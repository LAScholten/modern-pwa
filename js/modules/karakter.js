/**
 * Karakter Module - In 3 talen (NL, EN, DE)
 * Identieke styling als boek.js module
 */

// Module vertalingen
const karakterTranslations = {
    nl: {
        title: "Karakter",
        content: `
            <div class="karakter-content">
                <div class="row">
                    <div class="col-md-12 text-center mb-5">
                        <h1 class="display-1 fw-bold">karakter</h1>
                        <p class="lead mt-3">De essentie van het karakter van de Eurasier</p>
                    </div>
                </div>
                
                <div class="row mb-5">
                    <div class="col-md-12">
                        <h2 class="h3 mb-4 text-primary">Algemene karaktereigenschappen</h2>
                        <p class="mb-3">Zelfbewust, rustig met een hoge prikkeldrempel en terughoudend. Een combinatie van karaktereigenschappen die we veel terugzien in de honden van het Spitstype. De Eurasier is zeker van zijn zaak, zelfstandig en zal graag rust zoeken in een drukke omgeving.</p>
                        <p class="mb-3">Verder dringt de Eurasier zich niet op aan mensen maar zal juist afstand bewaren. Als het een Eurasier niet naar de zin is zal hij de situatie proberen te ontwijken en weggaan uit de voor hem onaangename omgeving. Daarnaast is de Eurasier graag bij het gezin en vindt hij het dus niet leuk afgezonderd te worden van de roedel, hij is niet graag alleen.</p>
                        <p class="mb-3">De Eurasier is geen luidruchtige hond. Waken doet hij wel, maar over het algemeen is de Eurasier geen felle waakhond. Hij blaft wanneer er vreemden op het terrein komen maar verder zal hij zich weinig laten horen.</p>
                        <p class="mb-3">De Eurasier heeft een jachtinstinct die hij volgt. Over het algemeen is het jachtgedrag matig ontwikkeld maar ook redelijk eenvoudig weg te trainen.</p>
                        <p class="mb-3">De opvoeding behoort consequent te gebeuren net als bij iedere andere hond. De Eurasier leert snel en is gebaat bij een positieve en gevarieerde manier van opvoeden. Bij teveel herhaling verveelt een Eurasier zich al snel en zal dan ook geen zin meer hebben in wat zijn baas van hem vraagt. Dit heeft als gevolg dat het op den duur juist tegenwerking gaat veroorzaken.</p>
                    </div>
                </div>
                
                <div class="row mb-5">
                    <div class="col-md-12">
                        <h2 class="h3 mb-4 text-primary">Omgang met mensen</h2>
                        <p class="mb-3">Voor familie en bekenden is de Eurasier een open en vrolijk ras. Voor vreemden is de Eurasier een ras dat ietwat afwachtend is. Liever tast hij eerst rustig af wie de persoon is die hij voor zich heeft. Dat neemt niet weg dat de Eurasier nieuwsgierig van aard is. Kijken en snuffelen om kennis te maken.</p>
                        <p class="mb-3">Dit wil nog niet meteen zeggen dat hij ook gelijk aangehaald wil worden. Daar kiezen ze zelf vaak een persoon voor uit. Geef de Eurasier dan ook de mogelijkheid zelf naar je toe te komen. Rustige en zelfbewuste mensen die geen dominant gedrag vertonen hebben doorgaans geen probleem om de Eurasier aan te halen.</p>
                        <p class="mb-3">Kinderen vormen over het algemeen geen probleem voor de Eurasier. Zelfs als de honden niet met kinderen zijn opgegroeid, zie je dat ze veel van kinderen accepteren. Let wel op dat de kinderen niet té opdringerig worden. Loopt de hond weg dan is dit een duidelijk signaal dat hij even geen behoefte heeft om met het kind in contact te komen. Zorg dan ook dat het kind niet achter de hond aan gaat. Laat het kind en de hond nooit alleen zonder toezicht van een volwassene.</p>
                        <p class="mb-3">Wat men vaak ziet is dat er een verschil zit tussen de reactie van de Eurasier op het aanhalen en gericht het hoofd betasten. Aaien vindt hij prima, maar als men gericht gaat betasten aan het hoofd, denk aan het controleren van het gebit, kan het wel eens zo zijn dat de Eurasier dit liever ontwijkt. Dit is rastypisch gedrag en hoort dus bij de Eurasier.</p>
                        <p class="mb-3">Aandachtspunt hierbij is dat het ontwijkend gedrag niet gepaard mag gaan met onzeker en/of angst. Ook al probeert een Eurasier het betasten te ontwijken, de oren horen nog altijd neutraal te blijven staan en ook de staart blijft over de rug. Oren die naar achteren gaan staan en de staart naar beneden gedragen duiden op onzekerheid en soms zelfs angst.</p>
                        <p class="mb-3">Mocht de Eurasier bij het betasten ontwijkend gedrag vertonen, neem dan rustig de tijd en maak even een praatje met de eigenaar. Zodra de Eurasier zelf weer toenadering zoekt, kun je het nogmaals proberen. Kijk de Eurasier niet strak in de ogen aan maar kijk erlangs of kijk richting de eigenaar. Draai zelf naast de hond en zak door je knieën, hierbij blijf je gewoon naar de eigenaar kijken en blijf met hem of haar in gesprek. Veelal zal het dan geen probleem zijn om een Eurasier te betasten.</p>
                        <p class="mb-3">Leeftijd speelt hierbij natuurlijk ook een rol. Rond de leeftijd van 7 maanden heeft de Eurasier net als veel andere rassen echt geen behoefte aan onbekenden die de hond overenthousiast betasten of aaien. Dring je dan niet op. Met het opdringen kun je namelijk vrij eenvoudig een onplezierige ervaring veroorzaken met als gevolg dat ze later terughoudender van karakter worden.</p>
                        <p class="mb-3">Uiteraard kom je een enkele keer een Eurasier tegen die dit alles niet zo ervaart en gewoon een allemansvriend is. Dit is natuurlijk geen bezwaar maar is niet hoe het ras oorspronkelijk bedoeld is.</p>
                    </div>
                </div>
                
                <div class="row mb-5">
                    <div class="col-md-12">
                        <h2 class="h3 mb-4 text-primary">Omgang met andere honden</h2>
                        <p class="mb-3">De houding van de Eurasier tegenover andere honden is per hond verschillend. Als fokker van het ras heb ik vele Eurasiers van dichtbij meegemaakt en daarbij vanzelfsprekend het gedrag naar andere honden bestudeerd.</p>
                        <p class="mb-3">Sprekend uit eigen ervaring, zien we vaak dat Eurasiers geen aandacht tonen naar andere honden. Toch heeft iedere hondeneigenaar zijn eigen opvatting over het gewenste gedrag naar andere honden. Mijn persoonlijke voorkeur gaat uit naar honden die een andere hond totaal links kunnen laten liggen en er voorbij kunnen lopen zonder reactie. In andere woorden, geen oog voor anderen maar oog voor eigen roedel.</p>
                        <p class="mb-3">Natuurlijk is geen enkele hond hetzelfde en is ook training erg belangrijk in het vormen van het gedrag. Er zijn dan ook genoeg Eurasiers die wél graag andere honden opzoeken.</p>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-12">
                        <h2 class="h3 mb-4 text-primary">Het verschil tussen reu en teef</h2>
                        <p class="mb-3">Het kiezen van het geslacht van je hond is natuurlijk een keuze die je als toekomstig hondeneigenaar zelf moet maken. Hoe maak je deze keuze? Denk hierbij goed na wat je in een Eurasier zoekt en wat je in de toekomst met je Eurasier wilt ondernemen.</p>
                        <p class="mb-3">Mocht je de wens hebben misschien ooit een nestje te fokken dan is de keuze gemakkelijk. Dat lukt nu eenmaal met een reu niet. Wel kan de reu zodra hij volwassen is natuurlijk als dekreu worden ingezet. Dat kan ook erg leuk zijn. Misschien heb je helemaal geen plannen om te fokken maar zoek je simpelweg een nieuw lid van de familie. Dan is het toch belangrijk om goed te kijken naar de verschillen tussen een reu en teef.</p>
                        <p class="mb-3">Eurasiers zijn tolerante honden. Teven verdragen elkaar vrijwel altijd prima. In alle jaren ben ik persoonlijk nog nooit een teef tegengekomen die niet met andere honden overweg kon. Wel zie je dat ze door hormoonschommelingen soms wat humeurig kunnen zijn richting soortgenoten. Wanneer je voor een teef kiest houdt dan ook rekening met de loopsheden zo'n twee keer per jaar.</p>
                        <p class="mb-3">Reuen zijn net als Eurasier teven tolerant. Bij sommige reuen kan het gebeuren dat ze sporadisch machogedrag vertonen naar andere reuen. Dit is meestal alleen aan de lijn, laat je hem loslopen dan is er nagenoeg nooit een probleem.</p>
                        <p class="mb-3">Mijn eigen ervaring heeft mij wel doen inzien dat Eurasier reuen eerder machogedrag vertonen naar andere Eurasier reuen maar dan weer geen probleem hebben met reuen van andere rassen. Blijkbaar zien ze die minder snel als concurrentie. Tegenover de eigen roedel is mijn ervaring dat de reuen wat meer knuffeldieren zijn en ook graag wat meer aandacht vragen.</p>
                        <p class="mb-3">Zelfs al ben je niet van plan jouw Eurasier in te zetten voor de fok is het alsnog af te raden de hond te castreren of steriliseren. Castreren heeft een overmatige vachtgroei als gevolg die erg veel onderhoud vergt. Daarnaast bestaat de kans dat het karakter van de hond door de castratie permanent verandert.</p>
                        <p class="mb-3">Door het wegnemen van mannelijke hormonen als gevolg van een castratie bij de reu wordt procentueel de hoeveelheid vrouwelijke hormonen groter. Hierdoor wordt de balans tussen mannelijke en vrouwelijke hormonen verstoord. Dit kan de reu een zachter karakter geven. Is de hond echter al onzeker, dan kan een castratie ervoor zorgen dat de reu nog onzekerder, of zelfs angstig kan worden.</p>
                        <p class="mb-3">Door het wegnemen van vrouwelijke hormonen als gevolg van castratie bij de teef wordt procentueel de hoeveelheid mannelijke hormonen groter. Ook hier wordt de balans tussen de hoeveelheid vrouwelijke en mannelijke hormonen verstoord. Dit kan een teef een feller karakter geven. Doe je dit bij een teef die van zichzelf al wat feller is dan kan het zijn dat het karakter dusdanig verandert dat ze onuitstaanbaar wordt voor haar omgeving.</p>
                        <p class="mb-3">Daarnaast kan het ook voorkomen dat een castratie leidt tot incontinentie. Indien niet medisch noodzakelijk is het dan ook zeer af te raden om je Eurasier te laten castreren.</p>
                    </div>
                </div>
            </div>
        `
    },
    en: {
        title: "Character",
        content: `
            <div class="karakter-content">
                <div class="row">
                    <div class="col-md-12 text-center mb-5">
                        <h1 class="display-1 fw-bold">character</h1>
                        <p class="lead mt-3">The essence of the Eurasier character</p>
                    </div>
                </div>
                
                <div class="row mb-5">
                    <div class="col-md-12">
                        <h2 class="h3 mb-4 text-primary">General Character Traits</h2>
                        <p class="mb-3">Self-confident, calm with a high stimulus threshold and reserved. A combination of character traits often seen in dogs of the Spitz type. The Eurasier is sure of itself, independent and will seek peace in a busy environment.</p>
                        <p class="mb-3">Furthermore, the Eurasier does not impose itself on people but will rather keep distance. If a Eurasier is not comfortable, it will try to avoid the situation and leave the unpleasant environment. Additionally, the Eurasier likes to be with the family and therefore does not enjoy being isolated from the pack; it does not like to be alone.</p>
                        <p class="mb-3">The Eurasier is not a noisy dog. It will guard, but generally the Eurasier is not a fierce guard dog. It barks when strangers come onto the property but otherwise will make little noise.</p>
                        <p class="mb-3">The Eurasier has a hunting instinct that it follows. Generally, hunting behavior is moderately developed but also fairly easy to train away.</p>
                        <p class="mb-3">Training should be consistent as with any other dog. The Eurasier learns quickly and benefits from positive and varied training methods. With too much repetition, a Eurasier quickly becomes bored and will lose interest in what its owner asks of it. This can eventually lead to resistance.</p>
                    </div>
                </div>
                
                <div class="row mb-5">
                    <div class="col-md-12">
                        <h2 class="h3 mb-4 text-primary">Interaction with People</h2>
                        <p class="mb-3">For family and acquaintances, the Eurasier is an open and cheerful breed. For strangers, the Eurasier is somewhat cautious. It prefers to calmly assess who the person is in front of it first. This does not mean the Eurasier is not curious by nature. It will observe and sniff to get acquainted.</p>
                        <p class="mb-3">This does not necessarily mean it wants to be petted immediately. They often choose a person for that themselves. Give the Eurasier the opportunity to come to you. Calm and self-confident people who do not display dominant behavior usually have no problem petting a Eurasier.</p>
                        <p class="mb-3">Children generally are not a problem for the Eurasier. Even if the dogs were not raised with children, you can see that they accept a lot from children. However, make sure the children do not become too intrusive. If the dog walks away, this is a clear signal that it does not want to interact with the child at that moment. Ensure the child does not chase the dog. Never leave the child and dog alone without adult supervision.</p>
                        <p class="mb-3">What is often observed is that there is a difference in the Eurasier's reaction to petting versus targeted touching of the head. It enjoys petting, but if one goes to specifically touch the head, such as checking teeth, the Eurasier may prefer to avoid this. This is typical breed behavior and is part of being a Eurasier.</p>
                        <p class="mb-3">The important point here is that the avoidant behavior should not be accompanied by uncertainty and/or fear. Even if a Eurasier tries to avoid being touched, the ears should remain neutral and the tail should stay over the back. Ears that go back and a tail carried low indicate uncertainty and sometimes even fear.</p>
                        <p class="mb-3">If a Eurasier shows avoidant behavior during touching, take your time calmly and chat with the owner for a moment. Once the Eurasier seeks contact again, you can try again. Do not stare directly into the Eurasier's eyes but look past it or towards the owner. Position yourself next to the dog and crouch down, while continuing to look at and talk with the owner. Usually, it will then be no problem to touch a Eurasier.</p>
                        <p class="mb-3">Age naturally also plays a role here. Around the age of 7 months, like many other breeds, the Eurasier really has no need for strangers who enthusiastically touch or pet the dog. Do not impose yourself then. By imposing, you can quite easily create an unpleasant experience, resulting in them becoming more reserved in character later.</p>
                        <p class="mb-3">Of course, you occasionally encounter a Eurasier that does not experience all of this and is simply everyone's friend. This is naturally not an objection but is not how the breed was originally intended.</p>
                    </div>
                </div>
                
                <div class="row mb-5">
                    <div class="col-md-12">
                        <h2 class="h3 mb-4 text-primary">Interaction with Other Dogs</h2>
                        <p class="mb-3">The attitude of the Eurasier towards other dogs varies per dog. As a breeder of the breed, I have closely observed many Eurasiers and naturally studied their behavior towards other dogs.</p>
                        <p class="mb-3">Speaking from personal experience, we often see that Eurasiers show no attention to other dogs. Yet every dog owner has their own opinion about desired behavior towards other dogs. My personal preference goes to dogs that can completely ignore another dog and walk past without reaction. In other words, no eye for others but eye for their own pack.</p>
                        <p class="mb-3">Of course, no dog is the same and training is also very important in shaping behavior. There are also plenty of Eurasiers that do like to seek out other dogs.</p>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-12">
                        <h2 class="h3 mb-4 text-primary">The Difference Between Male and Female</h2>
                        <p class="mb-3">Choosing the sex of your dog is naturally a choice you as a future dog owner must make yourself. How do you make this choice? Think carefully about what you are looking for in a Eurasier and what you want to undertake with your Eurasier in the future.</p>
                        <p class="mb-3">If you have the desire to maybe breed a litter someday, then the choice is easy. That simply doesn't work with a male. However, once mature, the male can naturally be used as a stud. That can also be very enjoyable. Maybe you have no plans to breed at all but are simply looking for a new family member. Then it is still important to look closely at the differences between a male and female.</p>
                        <p class="mb-3">Eurasiers are tolerant dogs. Females almost always get along well with each other. In all these years, I have personally never encountered a female that could not get along with other dogs. However, you do see that due to hormonal fluctuations they can sometimes be somewhat moody towards their own kind. When choosing a female, also consider the heat cycles about twice a year.</p>
                        <p class="mb-3">Males, like Eurasier females, are tolerant. With some males it can happen that they sporadically display macho behavior towards other males. This is usually only on the leash; if you let them run free, there is almost never a problem.</p>
                        <p class="mb-3">My own experience has shown me that Eurasier males are more likely to display macho behavior towards other Eurasier males but then have no problem with males of other breeds. Apparently they see those less as competition. Towards their own pack, my experience is that the males are more like cuddly animals and also like to ask for more attention.</p>
                        <p class="mb-3">Even if you do not plan to use your Eurasier for breeding, it is still not recommended to neuter or spay the dog. Neutering results in excessive coat growth that requires a lot of maintenance. Additionally, there is a chance that the dog's character will change permanently due to neutering.</p>
                        <p class="mb-3">By removing male hormones as a result of neutering in males, the proportion of female hormones becomes larger. This disrupts the balance between male and female hormones. This can give the male a softer character. However, if the dog is already insecure, neutering can cause the male to become even more insecure, or even fearful.</p>
                        <p class="mb-3">By removing female hormones as a result of spaying in females, the proportion of male hormones becomes larger. Here too, the balance between the amount of female and male hormones is disrupted. This can give a female a fiercer character. If you do this to a female that is already somewhat fierce, it may be that her character changes so much that she becomes unbearable for her environment.</p>
                        <p class="mb-3">Additionally, it can also occur that neutering leads to incontinence. If not medically necessary, it is therefore highly inadvisable to have your Eurasier neutered.</p>
                    </div>
                </div>
            </div>
        `
    },
    de: {
        title: "Charakter",
        content: `
            <div class="karakter-content">
                <div class="row">
                    <div class="col-md-12 text-center mb-5">
                        <h1 class="display-1 fw-bold">charakter</h1>
                        <p class="lead mt-3">Die Essenz des Eurasier-Charakters</p>
                    </div>
                </div>
                
                <div class="row mb-5">
                    <div class="col-md-12">
                        <h2 class="h3 mb-4 text-primary">Allgemeine Charaktereigenschaften</h2>
                        <p class="mb-3">Selbstbewusst, ruhig mit einer hohen Reizschwelle und zurückhaltend. Eine Kombination von Charaktereigenschaften, die wir häufig bei Hunden vom Spitz-Typ sehen. Der Eurasier ist sich seiner Sache sicher, selbstständig und wird gerne Ruhe in einer lauten Umgebung suchen.</p>
                        <p class="mb-3">Weiterhin drängt sich der Eurasier Menschen nicht auf, sondern hält lieber Abstand. Wenn es einem Eurasier nicht passt, wird er versuchen, die Situation zu vermeiden und aus der für ihn unangenehmen Umgebung wegzugehen. Zudem ist der Eurasier gerne bei der Familie und findet es daher nicht schön, vom Rudel getrennt zu werden; er ist nicht gerne allein.</p>
                        <p class="mb-3">Der Eurasier ist kein lärmender Hund. Wachen tut er zwar, aber im Allgemeinen ist der Eurasier kein scharfer Wachhund. Er bellt, wenn Fremde auf das Grundstück kommen, aber ansonsten wird man wenig von ihm hören.</p>
                        <p class="mb-3">Der Eurasier hat einen Jagdtrieb, dem er folgt. Im Allgemeinen ist das Jagdverhalten mäßig entwickelt, aber auch recht einfach wegzutrainieren.</p>
                        <p class="mb-3">Die Erziehung sollte konsequent erfolgen wie bei jedem anderen Hund. Der Eurasier lernt schnell und profitiert von einer positiven und abwechslungsreichen Erziehungsmethode. Bei zu viel Wiederholung langweilt sich ein Eurasier schnell und hat dann auch keine Lust mehr auf das, was sein Besitzer von ihm verlangt. Dies hat zur Folge, dass es auf Dauer gerade Gegenwirkung verursacht.</p>
                    </div>
                </div>
                
                <div class="row mb-5">
                    <div class="col-md-12">
                        <h2 class="h3 mb-4 text-primary">Umgang mit Menschen</h2>
                        <p class="mb-3">Für Familie und Bekannte ist der Eurasier eine offene und fröhliche Rasse. Für Fremde ist der Eurasier eine Rasse, die etwas abwartend ist. Lieber tastet er erst ruhig ab, wer die Person vor ihm ist. Das heißt nicht, dass der Eurasier nicht von Natur aus neugierig ist. Beobachten und schnuppern, um sich kennenzulernen.</p>
                        <p class="mb-3">Das bedeutet noch nicht unbedingt, dass er auch gleich gestreichelt werden möchte. Dafür wählen sie oft selbst eine Person aus. Geben Sie dem Eurasier also die Möglichkeit, selbst auf Sie zuzukommen. Ruhige und selbstbewusste Menschen, die kein dominantes Verhalten zeigen, haben in der Regel kein Problem, einen Eurasier zu streicheln.</p>
                        <p class="mb-3">Kinder stellen im Allgemeinen kein Problem für den Eurasier dar. Selbst wenn die Hunde nicht mit Kindern aufgewachsen sind, sieht man, dass sie viel von Kindern akzeptieren. Achten Sie jedoch darauf, dass die Kinder nicht zu aufdringlich werden. Läuft der Hund weg, ist dies ein deutliches Signal, dass er momentan kein Bedürfnis hat, mit dem Kind in Kontakt zu kommen. Sorgen Sie daher dafür, dass das Kind dem Hund nicht hinterherläuft. Lassen Sie Kind und Hund nie allein ohne Aufsicht eines Erwachsenen.</p>
                        <p class="mb-3">Was man oft sieht, ist, dass es einen Unterschied in der Reaktion des Eurasiers auf das Streicheln und das gezielte Betasten des Kopfes gibt. Streicheln findet er prima, aber wenn man gezielt den Kopf betastet, etwa um das Gebiss zu kontrollieren, kann es vorkommen, dass der Eurasier dies lieber vermeidet. Dies ist rassetypisches Verhalten und gehört also zum Eurasier.</p>
                        <p class="mb-3">Wichtig hierbei ist, dass das ausweichende Verhalten nicht mit Unsicherheit und/oder Angst einhergehen darf. Auch wenn ein Eurasier versucht, das Betasten zu vermeiden, sollten die Ohren immer noch neutral stehen und auch die Rute bleibt über dem Rücken. Ohren, die nach hinten gehen, und eine tief getragene Rute deuten auf Unsicherheit und manchmal sogar Angst hin.</p>
                        <p class="mb-3">Sollte der Eurasier beim Betasten ausweichendes Verhalten zeigen, nehmen Sie sich ruhig Zeit und führen Sie ein Gespräch mit dem Besitzer. Sobald der Eurasier selbst wieder Kontakt sucht, können Sie es erneut versuchen. Schauen Sie dem Eurasier nicht starr in die Augen, sondern schauen Sie daran vorbei oder Richtung Besitzer. Drehen Sie sich selbst neben den Hund und gehen Sie in die Knie, dabei schauen Sie einfach weiter den Besitzer an und bleiben Sie mit ihm im Gespräch. Meistens wird es dann kein Problem sein, einen Eurasier zu betasten.</p>
                        <p class="mb-3">Das Alter spielt hier natürlich auch eine Rolle. Rund um das Alter von 7 Monaten hat der Eurasier, wie viele andere Rassen auch, wirklich kein Bedürfnis nach Fremden, die den Hund übermäßig enthusiastisch betasten oder streicheln. Drängen Sie sich dann nicht auf. Durch Aufdrängen können Sie nämlich recht einfach eine unangenehme Erfahrung verursachen, mit der Folge, dass sie später zurückhaltender im Charakter werden.</p>
                        <p class="mb-3">Natürlich trifft man gelegentlich einen Eurasier, der all dies nicht so erlebt und einfach jedermanns Freund ist. Das ist natürlich kein Einwand, aber nicht so, wie die Rasse ursprünglich gedacht war.</p>
                    </div>
                </div>
                
                <div class="row mb-5">
                    <div class="col-md-12">
                        <h2 class="h3 mb-4 text-primary">Umgang mit anderen Hunden</h2>
                        <p class="mb-3">Die Haltung des Eurasiers gegenüber anderen Hunden ist je nach Hund unterschiedlich. Als Züchter der Rasse habe ich viele Eurasier aus nächster Nähe erlebt und dabei natürlich das Verhalten gegenüber anderen Hunden studiert.</p>
                        <p class="mb-3">Aus eigener Erfahrung sprechend sehen wir oft, dass Eurasier anderen Hunden gegenüber keine Aufmerksamkeit zeigen. Dennoch hat jeder Hundehalter seine eigene Vorstellung über das gewünschte Verhalten gegenüber anderen Hunden. Meine persönliche Präferenz geht zu Hunden, die einen anderen Hund völlig links liegen lassen und ohne Reaktion vorbeigehen können. Mit anderen Worten, kein Auge für andere, sondern Auge für das eigene Rudel.</p>
                        <p class="mb-3">Natürlich ist kein Hund gleich und auch das Training ist sehr wichtig für die Verhaltensformung. Es gibt auch genug Eurasier, die sehr gerne andere Hunde aufsuchen.</p>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-12">
                        <h2 class="h3 mb-4 text-primary">Der Unterschied zwischen Rüde und Hündin</h2>
                        <p class="mb-3">Die Wahl des Geschlechts Ihres Hundes ist natürlich eine Entscheidung, die Sie als zukünftiger Hundehalter selbst treffen müssen. Wie trifft man diese Wahl? Denken Sie gut darüber nach, was Sie in einem Eurasier suchen und was Sie in Zukunft mit Ihrem Eurasier unternehmen möchten.</p>
                        <p class="mb-3">Sollten Sie den Wunsch haben, vielleicht einmal einen Wurf zu züchten, dann ist die Wahl einfach. Das klappt nun mal mit einem Rüden nicht. Allerdings kann der Rüde, sobald er erwachsen ist, natürlich als Deckrüde eingesetzt werden. Das kann auch sehr schön sein. Vielleicht haben Sie überhaupt keine Pläne zu züchten, sondern suchen einfach ein neues Familienmitglied. Dann ist es dennoch wichtig, sich die Unterschiede zwischen Rüde und Hündin genau anzusehen.</p>
                        <p class="mb-3">Eurasier sind tolerante Hunde. Hündinnen vertragen sich fast immer bestens miteinander. In all den Jahren bin ich persönlich noch nie einer Hündin begegnet, die nicht mit anderen Hunden zurechtkam. Man sieht jedoch, dass sie durch Hormonschwankungen manchmal etwas launisch gegenüber Artgenossen sein können. Wenn Sie sich für eine Hündin entscheiden, berücksichtigen Sie auch die Läufigkeiten etwa zweimal im Jahr.</p>
                        <p class="mb-3">Rüden sind wie Eurasier-Hündinnen tolerant. Bei manchen Rüden kann es vorkommen, dass sie sporadisch Machoverhalten gegenüber anderen Rüden zeigen. Dies ist meist nur an der Leine; lässt man ihn frei laufen, gibt es so gut wie nie ein Problem.</p>
                        <p class="mb-3">Meine eigene Erfahrung hat mich erkennen lassen, dass Eurasier-Rüden eher Machoverhalten gegenüber anderen Eurasier-Rüden zeigen, aber dann wiederum kein Problem mit Rüden anderer Rassen haben. Offenbar sehen sie diese weniger schnell als Konkurrenz. Dem eigenen Rudel gegenüber ist meine Erfahrung, dass die Rüden etwas mehr Schmusetiere sind und auch gerne etwas mehr Aufmerksamkeit einfordern.</p>
                        <p class="mb-3">Selbst wenn Sie nicht vorhaben, Ihren Eurasier für die Zucht einzusetzen, ist es dennoch nicht ratsam, den Hund zu kastrieren oder sterilisieren. Kastration führt zu übermäßigem Fellwachstum, das sehr viel Pflege erfordert. Zudem besteht die Möglichkeit, dass sich der Charakter des Hundes durch die Kastration dauerhaft verändert.</p>
                        <p class="mb-3">Durch das Entfernen männlicher Hormone infolge einer Kastration beim Rüden wird prozentual die Menge weiblicher Hormone größer. Dadurch wird das Gleichgewicht zwischen männlichen und weiblichen Hormonen gestört. Dies kann dem Rüden einen weicheren Charakter geben. Ist der Hund jedoch bereits unsicher, kann eine Kastration dazu führen, dass der Rüde noch unsicherer oder sogar ängstlich werden kann.</p>
                        <p class="mb-3">Durch das Entfernen weiblicher Hormone infolge einer Kastration bei der Hündin wird prozentual die Menge männlicher Hormone größer. Auch hier wird das Gleichgewicht zwischen der Menge weiblicher und männlicher Hormone gestört. Dies kann einer Hündin einen schärferen Charakter geben. Macht man dies bei einer Hündin, die von sich aus bereits etwas schärfer ist, kann es sein, dass sich der Charakter so verändert, dass sie für ihre Umgebung unausstehlich wird.</p>
                        <p class="mb-3">Zudem kann es auch vorkommen, dass eine Kastration zu Inkontinenz führt. Wenn nicht medizinisch notwendig, ist es daher sehr abzuraten, Ihren Eurasier kastrieren zu lassen.</p>
                    </div>
                </div>
            </div>
        `
    }
};

// Functie om karakter module te initialiseren
function initKarakterModule() {
    console.log('Karakter module initialiseren...');
    
    // Creëer de module HTML - exact dezelfde structuur als boek.js
    const karakterHTML = `
        <div class="card">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-person-heart"></i> 
                        <span id="karakterTitle">Karakter</span>
                    </h5>
                </div>
            </div>
            <div class="card-body module-content">
                <div id="karakterContent">${karakterTranslations.nl.content}</div>
            </div>
        </div>
    `;
    
    return karakterHTML;
}

// Functie om karakter module te vertalen
function translateKarakterModule(lang) {
    const karakterTitle = document.getElementById('karakterTitle');
    const karakterContent = document.getElementById('karakterContent');
    
    if (karakterTitle && karakterTranslations[lang]) {
        karakterTitle.textContent = karakterTranslations[lang].title;
    }
    
    if (karakterContent && karakterTranslations[lang]) {
        karakterContent.innerHTML = karakterTranslations[lang].content;
    }
}

// Exporteer functies
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initKarakterModule,
        translateKarakterModule,
        karakterTranslations
    };
} else {
    // Maak functies globaal beschikbaar voor browser gebruik
    window.initKarakterModule = initKarakterModule;
    window.translateKarakterModule = translateKarakterModule;
}