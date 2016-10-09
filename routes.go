//go:generate esc -o static.go dist/bundle.js index.html

package main

import (
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/mastercactapus/librevault"
	"github.com/plimble/ace"
)

type folder struct {
	Path          string
	Peers         int
	DownBandwidth int
	UpBandwidth   int
	Files         int
	Type          librevault.SecretType
}

func calcBandwidth(peers []peer) (int, int) {
	var up, down int
	for _, p := range peers {
		up += p.UpBandwidth
		down += p.DownBandwidth
	}
	return up, down
}

func (d *daemonMonitor) Router() http.Handler {
	a := ace.New()
	a.GET("/api/folders", d.ServeHTTPFolders)
	a.GET("/api/folders/:folderPath/secrets", d.ServeHTTPFolderSecrets)
	a.DELETE("/api/folders/:folderPath", d.ServeHTTPDeleteFolder)
	a.POST("/api/folders", d.ServeHTTPCreateFolder)
	a.GET("/api/browse/*filepath", func(c *ace.C) {
		path := c.Param("filepath")
		infos, err := ioutil.ReadDir(path)
		if err != nil {
			if os.IsNotExist(err) {
				c.AbortWithStatus(404)
				return
			}

			if os.IsPermission(err) {
				c.AbortWithStatus(403)
				return
			}

			c.String(500, err.Error())
			return
		}
		resp := make([]string, 0, len(infos))
		for _, i := range infos {
			if !i.IsDir() {
				continue
			}
			if strings.HasPrefix(i.Name(), ".") {
				continue
			}

			resp = append(resp, i.Name())
		}

		c.JSON(200, resp)
	})

	fs := http.StripPrefix("/web/", http.FileServer(FS(false)))
	a.GET("/web/*filepath", func(c *ace.C) {
		fs.ServeHTTP(c.Writer, c.Request)
	})
	return a
}

func (d *daemonMonitor) ServeHTTPCreateFolder(c *ace.C) {
	s := d.GetState()
	if s == nil {
		c.AbortWithStatus(503)
		return
	}

	var req struct {
		Path   string
		Secret string
	}

	c.ParseJSON(&req)

	if req.Path == "" {
		c.String(400, "missing path")
		return
	}

	for _, f := range s.Folders {
		if f.Path == req.Path {
			c.String(409, "folder already exists at that path")
		}
	}

	var sec *librevault.Secret
	var err error
	if req.Secret == "" {
		sec, err = librevault.NewSecret()
		if err != nil {
			c.String(500, "could not create secret: %s", err.Error())
			return
		}
	} else {
		sec, err = librevault.ParseSecret(req.Secret)
		if err != nil {
			c.String(400, "bad secret: %s", err.Error())
			return
		}
	}

	f := folder{
		Path: req.Path,
		Type: sec.Type,
	}

	err = d.AddFolder(req.Path, sec)
	if err != nil {
		c.String(500, err.Error())
		return
	}

	c.JSON(201, f)
}

func (d *daemonMonitor) ServeHTTPDeleteFolder(c *ace.C) {
	s := d.GetState()
	if s == nil {
		c.AbortWithStatus(503)
		return
	}
	path, err := url.QueryUnescape(c.Param("folderPath"))
	if err != nil {
		c.String(400, "bad folderPath: %s", err.Error())
		return
	}

	for _, f := range s.Folders {
		if f.Path != path {
			continue
		}
		err = d.RemoveFolder(f.Secret)
		if err != nil {
			c.String(500, err.Error())
			return
		}
		// TODO: actually delete it
		c.String(200, f.Secret.String())
		return
	}

	c.AbortWithStatus(404)
}

func (d *daemonMonitor) ServeHTTPFolderSecrets(c *ace.C) {
	s := d.GetState()
	if s == nil {
		c.AbortWithStatus(503)
		return
	}
	path, err := url.QueryUnescape(c.Param("folderPath"))
	if err != nil {
		c.String(400, "bad folderPath: %s", err.Error())
		return
	}

	var res struct {
		OwnerSecret    string
		ReadSecret     string
		DownloadSecret string
	}

	for _, f := range s.Folders {
		if f.Path != path {
			continue
		}
		res.OwnerSecret = f.Secret.Owner()
		res.ReadSecret = f.Secret.ReadOnly()
		res.DownloadSecret = f.Secret.DownloadOnly()
		c.JSON(200, res)
		return
	}

	c.AbortWithStatus(404)
}

func (d *daemonMonitor) ServeHTTPFolders(c *ace.C) {
	s := d.GetState()
	if s == nil {
		c.AbortWithStatus(503)
		return
	}

	resp := make([]folder, len(s.Folders))
	for i, f := range s.Folders {
		up, down := calcBandwidth(f.Peers)
		resp[i] = folder{
			Path:          f.Path,
			Files:         f.Entries,
			Peers:         len(f.Peers),
			UpBandwidth:   up,
			DownBandwidth: down,
			Type:          f.Secret.Type,
		}
	}

	c.JSON(200, resp)
}
