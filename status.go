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
		}
	}
}

func (d *daemonMonitor) Update(s *daemonState) {
	d.setState <- s
}
func (d *daemonMonitor) GetState() *daemonState {
	return <-d.getState
}
