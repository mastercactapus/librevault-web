package main

import (
	"encoding/json"
	"time"

	"github.com/mastercactapus/librevault"
	log "github.com/sirupsen/logrus"
	"golang.org/x/net/websocket"
)

type updateMessage struct {
	State daemonState
}

type daemonState struct {
	Folders []folderState
}

type folderState struct {
	Entries  int  `json:"file_entries"`
	Indexing bool `json:"is_indexing"`
	Path     string
	Peers    []peer
	Secret   *librevault.Secret
}
type peer struct {
	Name          string
	DownBandwidth int `json:"down_bandwidth"`
	UpBandwidth   int `json:"up_bandwidth"`
}

type daemonMonitor struct {
	setState chan *daemonState
	getState chan *daemonState
	sendData chan []byte
}

func (d *daemonMonitor) loop() {
	var state *daemonState
	for {
		select {
		case state = <-d.setState:
		case d.getState <- state:
		}
	}
}

func newDaemonMonitor(url string) *daemonMonitor {
	d := &daemonMonitor{
		setState: make(chan *daemonState, 1),
		getState: make(chan *daemonState),
		sendData: make(chan []byte),
	}
	go d.loop()
	go d.monitor(url)
	return d
}

func (d *daemonMonitor) monitor(url string) {
	l := log.WithField("url", url).WithField("subsystem", "daemonMonitor")
	buf := make([]byte, 1024*1024)

	var ws *websocket.Conn
	var err error
	var n int

	var msg updateMessage
main:
	for {
		d.Update(nil)
		ws, err = websocket.Dial(url, "", "http://localhost")
		if err != nil {
			l.Errorln("connect failed:", err)
			time.Sleep(time.Second * 5)
			continue
		}
		l.Infoln("connected")

		for {
			n, err = ws.Read(buf)
			if err != nil {
				l.Errorln("read error:", err)
				ws.Close()
				continue main
			}

			err = json.Unmarshal(buf[:n], &msg)
			if err != nil {
				l.Errorln("decode error:", err)
				ws.Close()
				continue main
			}

			d.Update(&msg.State)

			// handling this here means we only write a packet immediately after the status
			// heartbeat. we could speed things up by handling it elsewhere, but we
			// don't get a response, so we need to wait for the next heartbeat anyhow
			// to see the result. therefore we allow this to live here.
			select {
			case data := <-d.sendData:
				_, err = ws.Write(data)
				if err != nil {
					l.Errorln("write error:", err)
					ws.Close()
					continue main
				}
			default:
			}
		}
	}
}

type daemonMessage struct {
	Command string `json:"command"`
}

func (d *daemonMonitor) AddFolder(path string, secret *librevault.Secret) error {
	var payload struct {
		Command string `json:"command"`
		Folder  struct {
			Path   string             `json:"path"`
			Secret *librevault.Secret `json:"secret"`
		} `json:"folder"`
	}
	payload.Command = "add_folder"
	payload.Folder.Path = path
	payload.Folder.Secret = secret
	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	d.sendData <- data
	return nil
}
func (d *daemonMonitor) RemoveFolder(secret *librevault.Secret) error {
	var payload struct {
		Command string             `json:"command"`
		Secret  *librevault.Secret `json:"secret"`
	}
	payload.Command = "remove_folder"
	payload.Secret = secret
	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	log.Infoln("remove", string(data))
	d.sendData <- data
	return nil
}
func (d *daemonMonitor) Update(s *daemonState) {
	d.setState <- s
}
func (d *daemonMonitor) GetState() *daemonState {
	return <-d.getState
}
