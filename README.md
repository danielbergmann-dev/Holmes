# Holmes & Watson — Die letzte Vorstellung

Eigenständiges deutschsprachiges Detektivspiel. Statische App mit 8 illustrierten begehbaren Schauplätzen, Touch-/Tastatursteuerung, W20-Proben, 10 Beweisen, 3 manuell herzuleitenden Schlussfolgerungen und 8 differenzierten Ausgängen. Keine Backend-Spielstände, keine Analyse, keine Werbung. Nebelpfad wird nicht verändert.

## Entwicklung

`dist/` ist der veröffentlichte Inhalt. `engine.mjs` enthält testbare Zeit-, Würfel-, Speicher- und Schlussfolgerungslogik; `story.mjs` den festen Fall und Konsequenzen; `world.mjs` Laufwege und Darstellung; `app.mjs` Oberfläche und Eingaben.

- `npm test`: Logik-, Routen- und Speicherprüfungen.
- Optional `npm install --no-save jsdom`, dann `node tests/ui-dom-check.mjs`: kompletter DOM-Durchlauf von Einführung bis Ausgang inklusive Würfel, Kartenreisen, Beweisverknüpfung und Fortsetzen. Dies ist kein visueller Browser-/Gerätetest.
- `node --check dist/app.mjs`: Syntaxprüfung.

Die optionalen Browser-Agent-Tools geben nur gesicherte Beweise aus und öffnen nur bereits gefundene Gegenstände. Sie verändern keine versteckten Ermittlungsdaten. Native WebMCP-Unterstützung wurde nicht in einem echten Browser geprüft.

Die drei Würfelproben verwenden eigene einfache Regeln. Keine D&D-Regelübernahme erforderlich. Die Literaturschauplätze und bekannten Figuren werden mit eigenem Fall und eigener Bildgestaltung verwendet.

## Bedienung

Weg antippen, Markierung oder „Erkunden“ auswählen. „Orte“ reist, „Beweise“ zeigt Details, „Fallakte“ verbindet Beweise und schließt den Fall ab. Uhr steht beim Lesen still. Kosten werden vor aufwendigen Handlungen angezeigt. Denkschritte sind kostenlos. Watson hilft auf Nachfrage. Klang ist optional. Reduzierte Bewegung wird respektiert.

Automatische lokale Speicherung, JSON-Export/-Import, Kapitelrücksprung nach Bestätigung. Spielstände sind pro Browser/Gerät getrennt. Service Worker speichert die öffentlichen Spielassets nach erfolgreichem Abruf; Sites-Zugangsschutz bleibt davon unabhängig.

## Kontinuität und Spoiler

Siehe docs/CASE-BIBLE.md. Die nächste Akte ist erzählerisch vorbereitet, aber nicht implementiert. Zugriff der neuen Site ist zunächst privat.
