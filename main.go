package main

import (
	"flag"
	"net/http"

	log "github.com/sirupsen/logrus"
	"rsc.io/letsencrypt"
)

func main() {
	dAddr := flag.String("daemon", "ws://localhost:42346/", "Daemon websocket URL. Used to connect to the librevault daemon")
	lAddr := flag.String("listen", ":42350", "Listen address:port. Used to serve the web UI")

	certFile := flag.String("certFile", "", "Certificate file for TLS.")
	keyFile := flag.String("keyFile", "", "Key file for TLS.")

	leCache := flag.String("cacheFile", "letsencrypt.cache", "Cache file for LetsEncrypt. Used to store certs accross restarts when using LetsEncrypt.")
	tlsEnabled := flag.Bool("tls", false, "Enable TLS. If certFile and keyFile are unspecified, a certificate will be obtained automatically from LetsEncrypt. This also implies port 80/443")

	flag.Parse()

	mon := newDaemonMonitor(*dAddr)
	http.Handle("/", mon.Router())

	if !*tlsEnabled {
		log.Fatal(http.ListenAndServe(*lAddr, nil))
	} else if *certFile == "" && *keyFile == "" {
		var m letsencrypt.Manager
		// http.HandleFunc("/", mon.ServeHTTP)
		if err := m.CacheFile(*leCache); err != nil {
			log.Fatal(err)
		}
		log.Fatal(m.Serve())
	} else {
		log.Fatal(http.ListenAndServeTLS(*lAddr, *certFile, *keyFile, nil))
	}

}
