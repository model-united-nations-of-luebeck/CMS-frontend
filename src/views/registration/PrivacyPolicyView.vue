<script setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const language = ref("en");
</script>
<!-- TODO: Add logic to switch between English and German translations of the privacy policy. -->
<template>
  <div class="privacy-policy-view">
    <v-sheet
      id="sheet"
      :elevation="mobile ? 0 : 2"
      :rounded="mobile ? false : 'lg'"
    >
      <div id="policy-content">
        <v-btn-toggle
          v-model="language"
          color="primary"
          variant="outlined"
          mandatory
          style="float: right; top: 16px; right: 16px"
        >
          <v-btn prepend-icon="mdi-kettle-steam" value="en">English</v-btn>
          <v-btn prepend-icon="mdi-sausage" value="de">Deutsch</v-btn>
        </v-btn-toggle>
        <h1>Datenschutzerklärung</h1>

        <h2>Kurzfassung</h2>

        <p>
          Der MUNOL e.V. betreibt dieses Conference Management System unter
          <a href="https://www.lebinphy.uber.space/cms/" target="_blank"
            >www.lebinphy.uber.space/cms/</a
          >
          unter Beachtung der einschlägigen Datenschutzbestimmungen.
        </p>
        <p>
          Im Rahmen der Nutzung dieses Angebots werden fallweise
          unterschiedliche personenbezogene Daten für folgende Zwecke erhoben:
        </p>
        <ul>
          <li>Übermittlung der Onlineinhalte</li>
          <li>Registrierung zur und Teilnahme an der MUNOL Konferenz</li>
        </ul>

        <p>Je nach Nutzung werden dabei Daten verarbeitet,</p>
        <ul>
          <li>
            die uns Ihr Browser bei einer Anfrage übersendet, etwa Ihre
            IP-Adresse bei der Anfrage nach Webinhalten (http-Request)
          </li>
          <li>
            die Sie in die Formulare eingeben, insbesondere zu Ihrer Person, wie
            zum Beispiel Name, E-Mail-Adresse, Geburtsdatum, Handynummer, etc.
            Eine ausführliche Liste befindet sich weiter unten.
          </li>
        </ul>

        <h2>Datenverarbeitende Stelle</h2>
        <p>
          Die datenverarbeitende Stelle dieses Conference Management Systems ist
          der MUNOL e.V, Thomas-Mann-Straße 14, 23564 Lübeck.
          <span>Kontakt: vorstand at munol.org</span>
        </p>
        <p>
          Wir versichern, dass wir die geltenden Datenschutzbestimmungen gemäß
          dem Telemediengesetz, dem Rundfunkstaatsvertrag, der
          Datenschutz-Grundverordnung (DSGVO), dem Bundesdatenschutzgesetz sowie
          weiteren datenschutzrechtlichen Bestimmungen befolgen. Der Schutz von
          personenbezogenen Daten ist uns hierbei sehr wichtig.
        </p>

        <h2>Rechtsgrundlagen</h2>
        <p>
          Wir verfolgen als gemeinnütziger Verein der politischen Bildung junger
          Menschen das Ziel der Unterstützung der Ideale und Ziele der Charta
          der Vereinten Nationen. Diesen Satzungszweck verwirklichen wir
          insbesondere durch die Ausrichtung und Veranstaltung der
          internationalen Schülerkonferenz Model United Nations of Lübeck
          (MUNOL). Die Übermittlung und Verarbeitung der Daten verfolgt dieses
          berechtigte Interesse (Art. 6 Abs. 1 lit. f DSGVO).
        </p>

        <h2>Speicherdauer</h2>
        <p>
          Wenn nicht im Folgenden anders angegeben, werden die Daten so lange
          gespeichert, wie es zu den beschriebenen Zwecken erforderlich ist und
          nur im Rahmen der gesetzlichen Speicherfristen.
        </p>

        <v-divider class="my-4"></v-divider>
        <p>
          Im Folgenden möchten wir Sie informieren, welche Daten erhoben,
          gespeichert und zu welchem Zweck sie verarbeitet werden.
        </p>

        <h2>Übermittlung der Onlineinhalte</h2>
        <p>
          Zum Zweck der Übermittlung der von Ihnen aufgerufenen Webseite
          (Sichtbarmachung der Webseite für Sie) werden von Ihrem Browser
          folgende Informationen (im Rahmen von sogenannten HTTP-Requests)
          übersandt:
        </p>
        <ul>
          <li>
            Ihre IP-Adresse, eine Ziffernfolge, die Ihren derzeitigen
            Computeranschluss im Internet identifiziert
          </li>
          <li>die von Ihnen aufgerufene Webseite</li>
          <li>
            Informationen zu dem von Ihnen verwendeten Browser und
            Betriebssystem, wie deren Name und die Version derselben
          </li>
          <li>
            sowie – unter Umständen – die Seite, von der aus Sie zu uns gelangt
            sind (Referrer-Information)
          </li>
        </ul>
        <p>
          Diese Daten werden zu Sicherheitszwecken für 7 weitere Tage in
          Log-Dateien gespeichert und danach automatisch gelöscht. Kommt es zu
          Störungen, werden diese Daten ggf. länger gespeichert und zur
          Ursachenermittlung verarbeitet und erst im Anschluss an diese
          gelöscht.
        </p>

        <h2>Registrierung zur und Teilnahme an der MUNOL Konferenz</h2>
        <p>
          Bei der Registrierung für die Teilnahme an der MUNOL Konferenz werden
          die folgenden Daten für folgende Zwecke freiwillig angegeben. Die
          Daten werden einen Monat nach der jeweiligen Konferenz gelöscht.
        </p>

        <h3 class="text-h6 mt-4">Teilnehmende Allgemein</h3>
        <v-table density="compact" class="mb-4" striped="odd">
          <thead>
            <tr>
              <th>Daten</th>
              <th>Zweck</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vorname, Name, Pronomen</td>
              <td>
                Personalisierte Ansprache, Teilnehmerausweis, Zertifikat,
                Anwesenheitslisten
              </td>
            </tr>
            <tr>
              <td>Geschlecht</td>
              <td>Unterbringung in Gastfamilien</td>
            </tr>
            <tr>
              <td>E-Mail</td>
              <td>Informationsweitergabe im Vorfeld der Konferenz</td>
            </tr>
            <tr>
              <td>Handynummer</td>
              <td>
                Kontaktaufnahme, insbesondere im Notfall während der Konferenz
              </td>
            </tr>
            <tr>
              <td>Geburtstag</td>
              <td>
                Alterskontrolle während der Konferenz, insbesondere Einhaltung
                der Jugendschutzgesetze bei Abendveranstaltungen
              </td>
            </tr>
            <tr>
              <td>Passbild</td>
              <td>
                Zugangskontrolle zu Konferenzveranstaltungen durch
                Teilnehmerausweis
              </td>
            </tr>
            <tr>
              <td>Rolle und Positionsname</td>
              <td>Gruppierung nach Teilnehmerrolle</td>
            </tr>
            <tr>
              <td>Zugehörige Schule (darüber auch Herkunftsort und -land)</td>
              <td>Teilnehmerausweis, Zertifikat, Unterbringung</td>
            </tr>
            <tr>
              <td>IP Adresse und Einwilligungszeitpunkt</td>
              <td>
                Speicherung der Einwilligung zur Datenverarbeitung sowie zur
                Medienfreigabe
              </td>
            </tr>
            <tr>
              <td>
                Weitere vom Teilnehmer in ein Freitextfeld eingetragene Daten
              </td>
              <td>
                Reibungslose Teilnahme an der Konferenz, insbesondere bei der
                Verpflegung und Unterbringung
              </td>
            </tr>
          </tbody>
        </v-table>

        <p>
          Je nach Teilnehmer Rolle werden weitere Daten erhoben und verarbeitet:
        </p>

        <h3>Delegate</h3>
        <v-table density="compact" class="mb-4" striped="odd">
          <thead>
            <tr>
              <th>Daten</th>
              <th>Zweck</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Botschafter Status</td>
              <td>
                Erster Ansprechpartner einer Delegation während der Konferenz,
                Zertifikaterstellung, Eröffnungsrede
              </td>
            </tr>
            <tr>
              <td>First Timer</td>
              <td>Optimierung der Konferenzerfahrung</td>
            </tr>
          </tbody>
        </v-table>

        <h3>MUN-Director</h3>
        <v-table density="compact" class="mb-4" striped="odd">
          <thead>
            <tr>
              <th>Daten</th>
              <th>Zweck</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Englisch als Unterrichtsfach</td>
              <td>
                Einbindung in die Korrektur von Resolutionen während der
                Konferenz
              </td>
            </tr>
          </tbody>
        </v-table>

        <h3 class="text-h6 mt-4">Advisor</h3>
        <v-table density="compact" class="mb-4" striped="odd">
          <thead>
            <tr>
              <th>Daten</th>
              <th>Zweck</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Erreichbarkeit (Zeiten)</td>
              <td>Kontaktaufnahme durch das Team bei Fragen und Notfällen</td>
            </tr>
            <tr>
              <td>Autoverfügbarkeit</td>
              <td>Hilfsanfragen bezüglich Transportes</td>
            </tr>
            <tr>
              <td>MUN-Erfahrung</td>
              <td>Einschätzung der Hilfsmöglichkeiten</td>
            </tr>
            <tr>
              <td>Hilfsbereiche</td>
              <td>Ablesung der Hilfsmöglichkeiten</td>
            </tr>
          </tbody>
        </v-table>

        <h2>Datenweitergabe an Dritte</h2>
        <p>
          Generell erfolgt keine Weitergabe personenbezogener Daten an Dritte,
          außer zu folgenden Zwecken an die folgenden Gruppen:
        </p>
        <ul>
          <li>gesetzliche Zwecke: an die entsprechenden Behörden</li>
          <li>
            Unterbringung in Gastfamilien (Privatpersonen): Name, Alter,
            Geschlecht und Kontaktdaten und Freitextinformationen zu Allergien,
            Essensunverträglichkeiten, Präferenzen werden an die Gastfamilien
            durch das Organisationsteam weitergegeben.
          </li>
          <li>
            Durchführung der Konferenz: Die Teilnehmerdaten werden an die
            entsprechenden Mitglieder das Organisationsteam (Executive Staff
            Team und Student Officers) weitergegeben zur Durchführung des ihnen
            jeweils anvertrauten Teils der Konferenz (zum Beispiel
            Essensinformationen an das Küchenteam oder Kontaktdaten an die
            jeweiligen Student Officer).
          </li>
        </ul>

        <h2 class="text-h6">Ihre Rechte</h2>
        <p>
          Wir möchten Sie darüber informieren, dass Sie jederzeit ein Recht auf
          unentgeltliche Auskunft über Ihre gespeicherten Daten sowie ein Recht
          auf Berichtigung, Löschung oder Sperrung von Daten, Widerspruch und
          Datenübertragbarkeit haben. Bitte wenden Sie sich hierzu ebenso für
          weitere Auskünfte oder für die Geltendmachung von Widerrufsrechten an:
        </p>

        E-Mail: vorstand at munol.org

        <p>
          Ferner haben Sie das Recht zur Beschwerde bei einer Aufsichtsbehörde.
        </p>

        <v-divider class="my-4"></v-divider>

        <h1 id="media-policy">
          Medienfreigabe – Einwilligung in die Verbreitung und öffentliche
          Zurschaustellung von Bildern (§ 22 KunstUrhG)
        </h1>

        <p>
          Jedem:r Teilnehmer:in obliegt es (gemäß § 22 KunstUrhG), seine:ihre
          Einwilligung zur Verbreitung und öffentlichen Zurschaustellung von
          Bildern, auf denen er:sie abgebildet ist, zu geben. Während der
          Konferenz entstandene Bild- und Tonaufnahmen von den Teilnehmern:innen
          können in diesem Fall auf unbestimmte Zeit oder bis zum Widerruf
          dieser Einwilligung unter Umständen im Internet auf der Webseite
          www.munol.org und auf sozialen Plattformen sowie im MUNOL-Magazin
          (Konferenzzeitschrift) veröffentlicht werden. Sollte die Einwilligung
          nicht erteilt werden, so können Aufnahmen, die nach § 23 Abs. 1
          KunstUrhG keiner persönlichen Einwilligung bedürfen, trotzdem auf oben
          genannten Kanälen veröffentlicht werden.
        </p>

        <p>
          Sollte ein:e Teilnehmer:in die Löschung einer veröffentlichten
          Aufnahme wünschen, so empfehlen wir eine sofortige Kontaktaufnahme mit
          dem Organisationsteam (ggf. Webmaster). Dies gilt sowohl für Fälle, in
          denen vorher eine Einwilligung erteilt wurde als auch für solche, in
          denen dies nicht geschehen ist.
        </p>

        <p>
          Die bei der Anmeldung eingereichten Passfotos werden ausschließlich
          für das Erstellen der Konferenzausweise verwendet.
        </p>

        <br />
        <p>Stand: 5. August 2025</p>

        <v-divider class="my-4"></v-divider>

        <p class="text-caption">
          Diese Datenschutzerklärung wurde auf Grundlage der
          Datenschutzerklärung unter
          <a href="https://irights.info/datenschutzerklaerung" target="_blank"
            >https://irights.info/datenschutzerklaerung</a
          >
          erstellt, welche unter
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"
            >CC 4.0 BY</a
          >
          lizensiert ist und von iRights erstellt wurde.
        </p>
      </div>
    </v-sheet>
  </div>
</template>

<style>
.v-main {
  --v-layout-top: 0 !important;
}

.privacy-policy-view {
  padding: 20px;
  background-color: #f5f5f5;
}

#sheet {
  margin: 20px 50px;

  /* on mobile screens no margin */
  @media (max-width: 600px) {
    margin: 0px 0;
  }
}

#policy-content {
  margin: 0px 100px;
  padding: 32px 0px;

  /* on mobile screens no margin */
  @media (max-width: 600px) {
    margin: 0px 0px;
  }
}

ul {
  margin-left: 32px;
}

h1 {
  margin-bottom: 16px;
}

h2 {
  margin-top: 16px;
  margin-bottom: 8px;
}

h3 {
  margin-top: 16px;
  margin-bottom: 8px;
}

p {
  margin-bottom: 8px;
  margin-top: 8px;
}

tr > th {
  font-weight: 1000 !important;
}
</style>
