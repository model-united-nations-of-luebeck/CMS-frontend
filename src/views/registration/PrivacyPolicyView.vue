<script setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const language = ref("en");
</script>

<template>
  <div class="privacy-policy-view">
    <v-sheet id="sheet" :elevation="mobile ? 0 : 2" :rounded="mobile ? false : 'lg'">
      <div id="policy-content">
        <v-btn-toggle
          id="language-toggle"
          v-model="language"
          color="primary"
          variant="outlined"
          mandatory
          style="float: right; top: 16px; right: 16px"
        >
          <v-btn value="en"
            ><img
              class="flag"
              src="https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/gb.svg"
            />English</v-btn
          >
          <v-btn value="de"
            ><img
              class="flag"
              src="https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/de.svg"
            />Deutsch</v-btn
          >
        </v-btn-toggle>

        <div v-if="language === 'de'">
          <h1>Datenschutzerklärung</h1>

          <h2>Kurzfassung</h2>

          <p>
            Der MUNOL e.V. betreibt dieses Conference Management System unter
            <a href="https://www.cms.munol.org" target="_blank" rel="noopener noreferrer"
              >www.cms.munol.org</a
            >
            unter Beachtung der einschlägigen Datenschutzbestimmungen.
          </p>
          <p>
            Im Rahmen der Nutzung dieses Angebots werden fallweise unterschiedliche personenbezogene
            Daten für folgende Zwecke erhoben:
          </p>
          <ul>
            <li>Übermittlung der Onlineinhalte</li>
            <li>Registrierung zur und Teilnahme an der MUNOL Konferenz</li>
          </ul>

          <p>Je nach Nutzung werden dabei Daten verarbeitet,</p>
          <ul>
            <li>
              die uns Ihr Browser bei einer Anfrage übersendet, etwa Ihre IP-Adresse bei der Anfrage
              nach Webinhalten (http-Request)
            </li>
            <li>
              die Sie in die Formulare eingeben, insbesondere zu Ihrer Person, wie zum Beispiel
              Name, E-Mail-Adresse, Geburtsdatum, Handynummer, etc. Eine ausführliche Liste befindet
              sich weiter unten.
            </li>
          </ul>

          <h2>Datenverarbeitende Stelle</h2>
          <p>
            Die datenverarbeitende Stelle dieses Conference Management Systems ist der MUNOL e.V,
            Thomas-Mann-Straße 14, 23564 Lübeck.
            <span>Kontakt: vorstand at munol.org</span>
          </p>
          <p>
            Wir versichern, dass wir die geltenden Datenschutzbestimmungen gemäß dem
            Telemediengesetz, dem Rundfunkstaatsvertrag, der Datenschutz-Grundverordnung (DSGVO),
            dem Bundesdatenschutzgesetz sowie weiteren datenschutzrechtlichen Bestimmungen befolgen.
            Der Schutz von personenbezogenen Daten ist uns hierbei sehr wichtig.
          </p>

          <h2>Rechtsgrundlagen</h2>
          <p>
            Wir verfolgen als gemeinnütziger Verein für politische Bildung junger Menschen das Ziel,
            die Ideale und Ziele der Charta der Vereinten Nationen zu unterstützen. Diesen
            Satzungszweck verwirklichen wir insbesondere durch die Ausrichtung und Veranstaltung der
            internationalen Schülerkonferenz Model United Nations of Lübeck (MUNOL). Die
            Übermittlung und Verarbeitung der Daten verfolgt dieses berechtigte Interesse (Art. 6
            Abs. 1 lit. f DSGVO).
          </p>

          <h2>Speicherdauer</h2>
          <p>
            Wenn nicht im Folgenden anders angegeben, werden die Daten so lange gespeichert, wie es
            zu den beschriebenen Zwecken erforderlich ist und nur im Rahmen der gesetzlichen
            Speicherfristen.
          </p>

          <v-divider class="my-4"></v-divider>
          <p>
            Im Folgenden möchten wir Sie informieren, welche Daten erhoben, gespeichert und zu
            welchem Zweck sie verarbeitet werden.
          </p>

          <h2>Übermittlung der Onlineinhalte</h2>
          <p>
            Zum Zweck der Übermittlung der von Ihnen aufgerufenen Webseite (Sichtbarmachung der
            Webseite für Sie) werden von Ihrem Browser folgende Informationen (im Rahmen von
            sogenannten HTTP-Requests) übersandt:
          </p>
          <ul>
            <li>
              Ihre IP-Adresse, eine Ziffernfolge, die Ihren derzeitigen Computeranschluss im
              Internet identifiziert
            </li>
            <li>die von Ihnen aufgerufene Webseite</li>
            <li>
              Informationen zu dem von Ihnen verwendeten Browser und Betriebssystem, wie deren Name
              und die Version derselben
            </li>
            <li>
              sowie – unter Umständen – die Seite, von der aus Sie zu uns gelangt sind
              (Referrer-Information)
            </li>
          </ul>
          <p>
            Diese Daten werden zu Sicherheitszwecken für 7 weitere Tage in Log-Dateien gespeichert
            und danach automatisch gelöscht. Kommt es zu Störungen, werden diese Daten ggf. länger
            gespeichert und zur Ursachenermittlung verarbeitet und erst im Anschluss an diese
            gelöscht.
          </p>

          <h2>Registrierung zur und Teilnahme an der MUNOL Konferenz</h2>
          <p>
            Bei der Registrierung für die Teilnahme an der MUNOL Konferenz werden die folgenden
            Daten für folgende Zwecke freiwillig angegeben. Die Daten werden einen Monat nach der
            jeweiligen Konferenz gelöscht.
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
                  Personalisierte Ansprache, Teilnehmerausweis, Zertifikat, Anwesenheitslisten
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
                <td>Kontaktaufnahme, insbesondere im Notfall während der Konferenz</td>
              </tr>
              <tr>
                <td>Geburtstag</td>
                <td>
                  Alterskontrolle während der Konferenz, insbesondere Einhaltung der
                  Jugendschutzgesetze bei Abendveranstaltungen
                </td>
              </tr>
              <tr>
                <td>Passbild</td>
                <td>Zugangskontrolle zu Konferenzveranstaltungen durch Teilnehmerausweis</td>
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
                <td>Speicherung der Einwilligung zur Datenverarbeitung sowie zur Medienfreigabe</td>
              </tr>
              <tr>
                <td>Weitere vom Teilnehmer in ein Freitextfeld eingetragene Daten</td>
                <td>
                  Reibungslose Teilnahme an der Konferenz, insbesondere bei der Verpflegung und
                  Unterbringung
                </td>
              </tr>
            </tbody>
          </v-table>

          <p>Je nach Teilnehmer Rolle werden weitere Daten erhoben und verarbeitet:</p>

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
                <td>Einbindung in die Korrektur von Resolutionen während der Konferenz</td>
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
            Generell erfolgt keine Weitergabe personenbezogener Daten an Dritte, außer zu folgenden
            Zwecken an die folgenden Gruppen:
          </p>
          <ul>
            <li>gesetzliche Zwecke: an die entsprechenden Behörden</li>
            <li>
              Unterbringung in Gastfamilien (Privatpersonen): Name, Alter, Geschlecht und
              Kontaktdaten und Freitextinformationen zu Allergien, Essensunverträglichkeiten,
              Präferenzen werden an die Gastfamilien durch das Organisationsteam weitergegeben.
            </li>
            <li>
              Durchführung der Konferenz: Die Teilnehmerdaten werden an die entsprechenden
              Mitglieder das Organisationsteam (Executive Staff Team und Student Officers)
              weitergegeben zur Durchführung des ihnen jeweils anvertrauten Teils der Konferenz (zum
              Beispiel Essensinformationen an das Küchenteam oder Kontaktdaten an die jeweiligen
              Student Officer).
            </li>
          </ul>

          <h2 class="text-h6">Ihre Rechte</h2>
          <p>
            Wir möchten Sie darüber informieren, dass Sie jederzeit ein Recht auf unentgeltliche
            Auskunft über Ihre gespeicherten Daten sowie ein Recht auf Berichtigung, Löschung oder
            Sperrung von Daten, Widerspruch und Datenübertragbarkeit haben. Bitte wenden Sie sich
            hierzu ebenso für weitere Auskünfte oder für die Geltendmachung von Widerrufsrechten an:
          </p>

          E-Mail: vorstand at munol.org

          <p>Ferner haben Sie das Recht zur Beschwerde bei einer Aufsichtsbehörde.</p>

          <v-divider class="my-4"></v-divider>

          <h1 id="media-policy">
            Medienfreigabe – Einwilligung in die Verbreitung und öffentliche Zurschaustellung von
            Bildern (§ 22 KunstUrhG)
          </h1>

          <p>
            Jedem:r Teilnehmer:in obliegt es (gemäß § 22 KunstUrhG), seine:ihre Einwilligung zur
            Verbreitung und öffentlichen Zurschaustellung von Bildern, auf denen er:sie abgebildet
            ist, zu geben. Während der Konferenz entstandene Bild- und Tonaufnahmen von den
            Teilnehmern:innen können in diesem Fall auf unbestimmte Zeit oder bis zum Widerruf
            dieser Einwilligung unter Umständen im Internet auf der Webseite www.munol.org und auf
            sozialen Plattformen sowie im MUNOL-Magazin (Konferenzzeitschrift) veröffentlicht
            werden. Sollte die Einwilligung nicht erteilt werden, so können Aufnahmen, die nach § 23
            Abs. 1 KunstUrhG keiner persönlichen Einwilligung bedürfen, trotzdem auf oben genannten
            Kanälen veröffentlicht werden.
          </p>

          <p>
            Sollte ein:e Teilnehmer:in die Löschung einer veröffentlichten Aufnahme wünschen, so
            empfehlen wir eine sofortige Kontaktaufnahme mit dem Organisationsteam (ggf. Webmaster).
            Dies gilt sowohl für Fälle, in denen vorher eine Einwilligung erteilt wurde als auch für
            solche, in denen dies nicht geschehen ist.
          </p>

          <p>
            Die bei der Anmeldung eingereichten Passfotos werden ausschließlich für das Erstellen
            der Konferenzausweise verwendet.
          </p>

          <br />
          <p>Stand: 5. August 2025</p>

          <v-divider class="my-4"></v-divider>

          <p class="text-caption">
            Diese Datenschutzerklärung wurde auf Grundlage der Datenschutzerklärung unter
            <a
              href="https://irights.info/datenschutzerklaerung"
              target="_blank"
              rel="noopener noreferrer"
              >https://irights.info/datenschutzerklaerung</a
            >
            erstellt, welche unter
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              >CC 4.0 BY</a
            >
            lizensiert ist und von iRights erstellt wurde.
          </p>
        </div>

        <!-- Englisch -->

        <div v-else>
          <h1>Privacy Policy</h1>

          <h2>Summary</h2>

          <p>
            MUNOL e.V. operates this Conference Management System at
            <a href="https://www.cms.munol.org" target="_blank" rel="noopener noreferrer"
              >www.cms.munol.org</a
            >
            in compliance with applicable data protection regulations.
          </p>
          <p>
            Depending on your use of this service, different personal data may be collected for the
            following purposes:
          </p>
          <ul>
            <li>Transmission of online content</li>
            <li>Registration for and participation in the MUNOL conference</li>
          </ul>

          <p>Depending on your usage, the following data may be processed:</p>
          <ul>
            <li>
              Data your browser sends with a request, such as your IP address when requesting web
              content (HTTP request)
            </li>
            <li>
              Data you enter into forms, especially personal data such as name, email address, date
              of birth, mobile number, etc. A detailed list can be found below.
            </li>
          </ul>

          <h2>Data Controller</h2>
          <p>
            The data controller for this Conference Management System is MUNOL e.V,
            Thomas-Mann-Straße 14, 23564 Lübeck.
            <span>Contact: vorstand at munol.org</span>
          </p>
          <p>
            We assure you that we comply with the applicable data protection regulations according
            to the Telemedia Act, the Interstate Broadcasting Treaty, the General Data Protection
            Regulation (GDPR), the Federal Data Protection Act, and other data protection laws. The
            protection of personal data is very important to us.
          </p>

          <h2>Legal Basis</h2>
          <p>
            As a non-profit association for the political education of young people, we aim to
            support the ideals and goals of the Charter of the United Nations. We fulfill this
            purpose especially by organizing the international student conference Model United
            Nations of Lübeck (MUNOL). The transmission and processing of data serves this
            legitimate interest (Art. 6 para. 1 lit. f GDPR).
          </p>

          <h2>Storage Duration</h2>
          <p>
            Unless otherwise stated below, data is stored only as long as necessary for the
            described purposes and only within the framework of statutory retention periods.
          </p>

          <v-divider class="my-4"></v-divider>
          <p>
            Below, we inform you about which data is collected, stored, and for what purpose it is
            processed.
          </p>

          <h2>Transmission of Online Content</h2>
          <p>
            For the purpose of transmitting the website you have accessed (making the website
            visible to you), your browser sends the following information (as part of so-called HTTP
            requests):
          </p>
          <ul>
            <li>
              Your IP address, a sequence of numbers identifying your current computer connection to
              the Internet
            </li>
            <li>The website you have accessed</li>
            <li>
              Information about the browser and operating system you use, such as their names and
              versions
            </li>
            <li>
              and – if applicable – the page from which you arrived at our site (referrer
              information)
            </li>
          </ul>
          <p>
            This data is stored in log files for security purposes for a further 7 days and then
            automatically deleted. In case of disruptions, this data may be stored longer and
            processed for troubleshooting, and deleted afterwards.
          </p>

          <h2>Registration for and Participation in the MUNOL Conference</h2>
          <p>
            When registering for participation in the MUNOL conference, the following data is
            provided voluntarily for the following purposes. The data will be deleted one month
            after the respective conference.
          </p>

          <h3 class="text-h6 mt-4">Participants in General</h3>
          <v-table density="compact" class="mb-4" striped="odd">
            <thead>
              <tr>
                <th>Data</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>First name, Last name, Pronouns</td>
                <td>Personalized addressing, participant badge, certificate, attendance lists</td>
              </tr>
              <tr>
                <td>Gender</td>
                <td>Accommodation in host families</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>Information sharing before the conference</td>
              </tr>
              <tr>
                <td>Mobile number</td>
                <td>Contact, especially in emergencies during the conference</td>
              </tr>
              <tr>
                <td>Date of birth</td>
                <td>
                  Age verification during the conference, especially compliance with youth
                  protection laws at evening events
                </td>
              </tr>
              <tr>
                <td>Passport photo</td>
                <td>Access control to conference events via participant badge</td>
              </tr>
              <tr>
                <td>Role and position name</td>
                <td>Grouping by participant role</td>
              </tr>
              <tr>
                <td>Affiliated school (including place and country of origin)</td>
                <td>Participant badge, certificate, accommodation</td>
              </tr>
              <tr>
                <td>IP address and consent timestamp</td>
                <td>Storage of consent to data processing and media release</td>
              </tr>
              <tr>
                <td>Other data entered by the participant in a free text field</td>
                <td>
                  Smooth participation in the conference, especially regarding catering and
                  accommodation
                </td>
              </tr>
            </tbody>
          </v-table>

          <p>Depending on the participant's role, further data may be collected and processed:</p>

          <h3>Delegate</h3>
          <v-table density="compact" class="mb-4" striped="odd">
            <thead>
              <tr>
                <th>Data</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ambassador status</td>
                <td>
                  Main contact person of a delegation during the conference, certificate creation,
                  opening speech
                </td>
              </tr>
              <tr>
                <td>First timer</td>
                <td>Optimization of the conference experience</td>
              </tr>
            </tbody>
          </v-table>

          <h3>MUN-Director</h3>
          <v-table density="compact" class="mb-4" striped="odd">
            <thead>
              <tr>
                <th>Data</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>English as a teaching subject</td>
                <td>Involvement in the correction of resolutions during the conference</td>
              </tr>
            </tbody>
          </v-table>

          <h3 class="text-h6 mt-4">Advisor</h3>
          <v-table density="compact" class="mb-4" striped="odd">
            <thead>
              <tr>
                <th>Data</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Availability (times)</td>
                <td>Contact by the team in case of questions and emergencies</td>
              </tr>
              <tr>
                <td>Car availability</td>
                <td>Assistance requests regarding transport</td>
              </tr>
              <tr>
                <td>MUN experience</td>
                <td>Assessment of possible assistance</td>
              </tr>
              <tr>
                <td>Areas of assistance</td>
                <td>Reading out possible assistance</td>
              </tr>
            </tbody>
          </v-table>

          <h2>Disclosure of Data to Third Parties</h2>
          <p>
            In general, no personal data is passed on to third parties, except for the following
            purposes to the following groups:
          </p>
          <ul>
            <li>Legal purposes: to the relevant authorities</li>
            <li>
              Accommodation in host families (private individuals): Name, age, gender, contact
              details, and free text information on allergies, food intolerances, preferences are
              passed on to host families by the organizing team.
            </li>
            <li>
              Conducting the conference: Participant data is passed on to the relevant members of
              the organizing team (Executive Staff Team and Student Officers) for the execution of
              their respective parts of the conference (for example, food information to the kitchen
              team or contact details to the respective Student Officer).
            </li>
          </ul>

          <h2 class="text-h6">Your Rights</h2>
          <p>
            We would like to inform you that you have the right at any time to free information
            about your stored data as well as the right to correction, deletion, or blocking of
            data, objection, and data portability. Please contact us for further information or to
            exercise your right of withdrawal at:
          </p>

          Email: vorstand at munol.org

          <p>You also have the right to lodge a complaint with a supervisory authority.</p>

          <v-divider class="my-4"></v-divider>

          <h1 id="media-policy">
            Media Release – Consent to the Distribution and Public Display of Images (§ 22 German
            Art Copyright Act)
          </h1>

          <p>
            Each participant is responsible (according to § 22 German Art Copyright Act) for giving
            their consent to the distribution and public display of images in which they are
            depicted. Photos and audio recordings of participants taken during the conference may,
            in this case, be published on the website www.munol.org, on social platforms, and in the
            MUNOL magazine (conference magazine) for an indefinite period or until this consent is
            revoked. If consent is not given, images that do not require personal consent according
            to § 23 para. 1 German Art Copyright Act may still be published on the above-mentioned
            channels.
          </p>

          <p>
            If a participant wishes to have a published image deleted, we recommend immediate
            contact with the organizing team (or webmaster). This applies both to cases where
            consent was previously given and to those where it was not.
          </p>

          <p>
            Passport photos submitted during registration are used exclusively for creating
            conference badges.
          </p>

          <br />
          <p>Last updated: August 5, 2025</p>

          <v-divider class="my-4"></v-divider>

          <p class="text-caption">
            This privacy policy is based on the privacy policy at
            <a
              href="https://irights.info/datenschutzerklaerung"
              target="_blank"
              rel="noopener noreferrer"
              >https://irights.info/datenschutzerklaerung</a
            >
            which is licensed under
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              >CC 4.0 BY</a
            >
            and was created by iRights.
          </p>
        </div>
      </div>
    </v-sheet>
  </div>
</template>

<style>
.privacy-policy-view {
  padding: 20px;
  background-color: #f5f5f5;

  /* on mobile screens no margin */
  @media (max-width: 600px) {
    margin: 20px;
    padding: 0px;
  }
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
    margin: 0px;
    padding: 0px;
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

.flag {
  width: 24px;
  margin-right: 10px;
}

#language-toggle {
  /* center on mobile screens */
  @media (max-width: 600px) {
    float: none !important;
    display: flex;
    justify-content: center;
  }
}
</style>
