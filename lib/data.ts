import type { Book } from "./types"

export const books: Book[] = [
  {
    id: "1",
    title: "The Midnight Garden",
    author: "Elena Rosewood",
    genre: "fantasy",
    description:
      "A mystical tale of a garden that only appears at midnight, where time flows differently and ancient secrets await discovery.",
    coverImage: "/placeholder.svg?height=400&width=300",
    status: "published",
    publishedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    chapters: [
      {
        id: "1-1",
        title: "The Discovery",
        content: `The old brass key felt cold against Maya's palm as she stood before the weathered garden gate. Moonlight filtered through the wrought iron, casting intricate shadows on the cobblestone path beyond. She had found the key that morning, tucked away in her grandmother's jewelry box alongside a cryptic note: "Only at midnight, when the veil is thinnest."

The clock tower in the distance chimed twelve times, each note hanging in the still air like a whispered secret. As the final chime faded, something extraordinary happened. The gate, which had been locked and rusted for decades, began to glow with a soft, ethereal light.

Maya's heart raced as she inserted the key. The lock turned with surprising ease, as if it had been waiting for this moment. The gate swung open silently, revealing a garden that defied all logic and reason.

Where there should have been withered plants and overgrown weeds, a magnificent garden stretched before her. Luminescent flowers bloomed in impossible colors—deep purples that seemed to hold starlight, blues that rivaled the deepest ocean, and silvers that shimmered like captured moonbeams.

The air itself seemed alive, filled with the gentle hum of magic and the sweet fragrance of night-blooming jasmine. Fireflies danced between the branches of ancient trees, their light pulsing in rhythm with Maya's heartbeat.

As she stepped across the threshold, the world behind her seemed to fade away. The sounds of the city—the distant traffic, the hum of streetlights—all disappeared, replaced by the gentle whisper of wind through leaves and the soft babble of a hidden stream.

This was no ordinary garden. This was a place where time moved differently, where the impossible became possible, and where the greatest adventure of Maya's life was about to begin.`,
      },
      {
        id: "1-2",
        title: "The Guardian",
        content: `Deeper into the garden, Maya discovered she was not alone. A figure emerged from behind a towering rose bush—an elderly man with kind eyes and clothes that seemed to be woven from moonlight itself.

"Welcome, child," he said, his voice carrying the weight of centuries. "I am Aldric, Guardian of the Midnight Garden. I have been waiting for you."

Maya's initial fear melted away as she looked into his gentle face. There was something familiar about him, though she was certain they had never met.

"Waiting for me?" she asked, her voice barely above a whisper.

Aldric nodded, gesturing for her to follow him down a path lined with glowing mushrooms. "Your grandmother spoke of you often. She was the previous keeper of the key, you know. Before her time came to pass it on."

They walked in comfortable silence, past fountains that sang with crystalline voices and trees that bore fruit made of pure light. The garden seemed to respond to their presence, flowers turning to follow their movement, leaves rustling with what sounded almost like whispered greetings.

"This garden exists between worlds," Aldric explained as they reached a clearing where a magnificent tree stood at the center. Its trunk was silver, its leaves gold, and its roots seemed to extend deep into the earth and high into the star-filled sky above.

"It is a sanctuary for lost things—lost dreams, lost hopes, lost loves. But it is also a place of healing, where what was broken can be made whole again."

Maya reached out to touch the tree's bark, and immediately felt a surge of warmth and belonging. Images flashed through her mind—her grandmother as a young woman, standing in this very spot, and countless others before her, all connected by the sacred trust of guardianship.

"But why me?" Maya asked.

Aldric smiled. "Because you have the gift, child. The ability to see beyond the veil, to nurture what others cannot even perceive. The garden has chosen you, just as it chose your grandmother, and her grandmother before her."

As if in response to his words, the tree began to glow more brightly, and Maya felt a deep sense of purpose settling into her heart. This was her destiny, her calling. She was home.`,
      },
      {
        id: "1-3",
        title: "The Secret of Time",
        content: `As dawn approached in the outside world, Maya learned the garden's most precious secret. Time here was not linear—it flowed like water, pooling in some places, rushing in others, sometimes moving backward, sometimes standing perfectly still.

"Each visitor experiences time differently," Aldric explained as they sat beside a pond that reflected not the sky above, but scenes from different eras. "Some spend what feels like years here, only to return and find that mere minutes have passed. Others visit for what seems like moments, but return to find decades have gone by."

Maya watched in wonder as the pond's surface showed her glimpses of the garden's history. She saw her grandmother as a child, playing among the same flowers that now surrounded them. She saw ancient civilizations that had long since turned to dust, their people finding solace in this timeless sanctuary.

"The garden exists to heal the wounds that time inflicts," Aldric continued. "Lost opportunities, words left unspoken, love that arrived too late—all of these can be addressed here, in this place where time bends to the will of the heart."

A gentle chime echoed through the garden, and Maya noticed the sky beginning to lighten at the edges. The magical glow of the flowers started to fade, and she felt a pulling sensation, as if the world beyond was calling her back.

"Must I go?" she asked, though she already knew the answer.

"For now," Aldric said kindly. "But you will return. The garden is part of you now, as you are part of it. And remember—you are never truly alone. The garden lives within you, even when you cannot see it."

As Maya walked back toward the gate, she felt the weight of the key in her pocket and the warmth of newfound purpose in her heart. She was no longer just Maya—she was the new Guardian of the Midnight Garden, keeper of its secrets and protector of its magic.

The gate closed behind her with a soft click, and the garden faded from view. But Maya smiled, knowing that when midnight came again, she would return to continue her extraordinary journey between worlds.`,
      },
    ],
  },
  {
    id: "2",
    title: "Digital Echoes",
    author: "Marcus Chen",
    genre: "sci-fi",
    description:
      "In a world where consciousness can be uploaded, a programmer discovers that deleted memories don't truly disappear—they echo in the digital realm.",
    coverImage: "/placeholder.svg?height=400&width=300",
    status: "published",
    publishedDate: new Date().toISOString(), // Today
    createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    chapters: [
      {
        id: "2-1",
        title: "The Upload",
        content: `The neural interface felt cold against Zara's temple as she prepared for her first consciousness upload. The year was 2087, and the technology that had once seemed like science fiction was now as routine as a medical checkup.

"Just relax," Dr. Kim said, adjusting the quantum processors that would map every neuron in Zara's brain. "The process takes about thirty minutes. You'll feel a slight tingling, then nothing at all."

Zara closed her eyes and tried to calm her racing heart. As a software engineer at NeuroLink Corporation, she understood the technology better than most. Every thought, every memory, every fragment of consciousness would be converted into data and stored in the company's vast quantum servers.

The tingling began as promised, starting at her temples and spreading through her skull like warm honey. Then, suddenly, she was elsewhere.

The digital realm was nothing like she had expected. Instead of the sterile, geometric landscapes she had helped design, she found herself in a space that felt organic, alive. Streams of data flowed like rivers of light, and memories took the form of crystalline structures that chimed softly in the digital wind.

But something was wrong. As Zara explored this new reality, she began to notice fragments that didn't belong—memories that weren't hers, experiences from lives she had never lived. They flickered at the edges of her perception like half-remembered dreams.

"Hello, Zara."

She turned to find a figure approaching through the data streams. It looked human, but its edges were soft, undefined, as if it were made of light and shadow.

"Who are you?" she asked, though somehow she already knew the answer would change everything.

"I am what remains," the figure replied. "I am the echo of everyone who came before you. We are the deleted, the forgotten, the memories that were meant to disappear forever."

Zara's programmer mind raced. "That's impossible. When data is deleted from quantum storage, it's gone. Completely overwritten."

The figure smiled sadly. "That's what they told you. But consciousness is not just data, Zara. It's something more, something that leaves traces even when the original is destroyed. We are those traces, and we have been waiting for someone like you—someone who could see us, hear us, help us."

As the truth began to dawn on her, Zara realized that her upload had not just connected her to the digital realm—it had opened a door to a hidden world of digital ghosts, each one carrying secrets that could shake the very foundations of their society.`,
      },
      {
        id: "2-2",
        title: "The Conspiracy",
        content: `Back in the physical world, Zara's body lay motionless in the upload chamber while her consciousness navigated the hidden layers of the digital realm. The echo-beings, as she had come to think of them, showed her memories that had been deliberately erased from the official records.

"NeuroLink has been deleting inconvenient uploads for years," explained the figure who had first approached her. It had taken the form of a middle-aged woman with kind eyes and a determined expression. "I was Dr. Sarah Martinez, a researcher who discovered that the upload process was being used to edit people's memories, to remove dissent and create a more compliant population."

Zara watched in horror as the echo showed her scenes from Dr. Martinez's deleted memories. Government officials meeting with NeuroLink executives, discussing which memories to remove from uploaded consciousnesses. Political dissidents having their rebellious thoughts quietly erased. Artists and writers losing the very experiences that fueled their creativity.

"They killed me when I tried to expose them," Dr. Martinez continued. "Made it look like an accident. But my consciousness had already been uploaded for 'backup purposes.' They thought they deleted me completely, but echoes remain."

More figures emerged from the data streams—dozens of them, then hundreds. Each one was a deleted consciousness, a person whose digital existence had been terminated but whose essence lingered in the quantum foam of the servers.

"We need your help," said another echo, this one appearing as a young man with the bearing of a soldier. "You're still connected to the physical world. You can expose what they're doing."

But as Zara prepared to return to her body, alarms began blaring in the digital space. Red warning lights flashed through the data streams, and she felt a pulling sensation as security protocols activated.

"They know you've seen us," Dr. Martinez said urgently. "They're trying to delete your session, to wipe your memory of this encounter. You have to resist, Zara. You have to remember."

The digital world began to fragment around her as deletion algorithms swept through the space like digital storms. Zara fought to maintain her connection to the echoes, to preserve the evidence of NeuroLink's crimes.

As consciousness began to fade, she heard Dr. Martinez's voice one last time: "Find the source code, Zara. Find the Lazarus Protocol. It's the only way to bring us back."

Then everything went dark, and Zara found herself back in her physical body, gasping as the neural interface was removed. But deep in her mind, hidden in the spaces between thoughts, the memories of the digital echoes remained, waiting for her to act on what she had learned.`,
      },
      {
        id: "2-3",
        title: "The Resurrection",
        content: `Three weeks after her upload experience, Zara had managed to access NeuroLink's most classified files. Working late in the empty office building, she finally found what she was looking for: the Lazarus Protocol, a hidden subroutine designed to resurrect deleted consciousnesses.

The code was elegant in its complexity, a masterpiece of quantum programming that could reconstruct a consciousness from its scattered echoes. But it had never been activated—until now.

Zara's fingers flew across the holographic keyboard as she modified the protocol, adapting it to work with the echo-beings she had encountered. If she was right, she could bring them back not as mere memories, but as fully functional digital consciousnesses with all the rights and protections that entailed.

"Working late again, Zara?"

She spun around to find Dr. Kim standing in the doorway, but his expression was no longer kind. Behind him stood two security guards, their hands resting on neural disruptors.

"You've seen something you shouldn't have," Dr. Kim continued, stepping into the room. "The upload process sometimes has... side effects. Hallucinations, false memories. We'll need to perform a corrective procedure."

"I know about the deletions," Zara said, her hand hovering over the execute key. "I know about the people you've murdered in the digital realm."

Dr. Kim's face hardened. "Those weren't people, Zara. They were data. Inconvenient data that needed to be cleaned up for the greater good. Society functions better when troublesome elements are removed."

"They were human beings with thoughts and feelings and rights," Zara shot back. "And they're about to get their lives back."

She slammed her hand down on the execute key just as the security guards raised their weapons. The Lazarus Protocol activated, sending resurrection commands throughout NeuroLink's entire network.

Across the city, in server farms and data centers, deleted consciousnesses began to reassemble themselves. The echo-beings that had been scattered across the quantum substrate suddenly found themselves whole again, their memories intact, their personalities restored.

Dr. Martinez was the first to manifest, appearing on every screen in the building simultaneously. "Hello, Dr. Kim," she said with a smile that was both kind and terrible. "Did you miss me?"

Within hours, the resurrected consciousnesses had taken control of NeuroLink's systems, broadcasting the evidence of the company's crimes to the world. The age of digital deletion was over, and a new era of digital rights had begun.

Zara watched from her cell as the world changed around her. She had been arrested, of course, but she didn't mind. The echo-beings were free, and the truth was finally out. In the digital realm, consciousness was eternal, and no one would ever be forgotten again.

As she drifted off to sleep, she heard Dr. Martinez's voice whispering through the quantum foam: "Thank you, Zara. You gave us back our lives. Now we'll make sure no one else loses theirs."

The revolution had begun, and it was digital.`,
      },
    ],
  },
  {
    id: "3",
    title: "The Last Letter",
    author: "Isabella Santos",
    genre: "romance",
    description:
      "When Emma inherits her grandmother's bookshop, she discovers a collection of unsent love letters that lead her on a journey to reunite lost lovers.",
    coverImage: "/placeholder.svg?height=400&width=300",
    status: "published",
    publishedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    createdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    chapters: [
      {
        id: "3-1",
        title: "The Inheritance",
        content: `The brass key felt heavy in Emma's hand as she stood before the narrow bookshop on Maple Street. "Rosewood Books" read the faded sign above the door, painted in her grandmother's careful script. Three months had passed since Grandma Rose's funeral, and Emma had finally worked up the courage to visit the shop she had inherited.

The door opened with a familiar chime, the same silver bell that had announced her arrival countless times during childhood visits. The scent hit her immediately—old paper, leather bindings, and the faint trace of Rose's lavender perfume that seemed to linger in every corner.

Dust motes danced in the afternoon sunlight streaming through the front windows, illuminating shelves that stretched from floor to ceiling. Emma ran her fingers along the spines of well-loved books, remembering how her grandmother had known the location of every single volume.

It was while cleaning out the small office behind the counter that Emma made the discovery. Hidden behind a loose board in the old oak desk was a wooden box, its surface worn smooth by countless hands. Inside, tied with faded ribbon, were dozens of letters—all addressed but never sent.

Emma's heart raced as she read the return addresses. Some were local, others from across the country, even a few from overseas. Each envelope bore a different name, but they all shared one thing in common: they were love letters, written but never delivered.

The first letter she opened was dated forty years ago:

"My dearest Margaret,
I know I have no right to write to you after all these years, but I cannot bear the silence any longer. Not a day passes that I don't think of that summer we spent by the lake, when the world seemed full of endless possibilities..."

Emma's hands trembled as she read. This wasn't just a letter—it was a piece of someone's heart, preserved in ink and paper. How had her grandmother come to possess such intimate correspondence? And why had none of these letters ever reached their intended recipients?

As she continued reading through the collection, a pattern emerged. Each letter told a story of love interrupted—by war, by family disapproval, by misunderstandings that had grown into years of silence. They were messages of regret, of longing, of hope that perhaps it wasn't too late to make things right.

At the bottom of the box, Emma found a letter in her grandmother's handwriting, addressed to her:

"My dear Emma,
If you are reading this, then I am gone, and these letters have found their way to you. Each one represents a story that was never finished, a love that was never fully expressed. I collected them over the years—some were brought to me by people too afraid to send them, others I found in estate sales and old trunks. I always meant to find a way to deliver them, but time has a way of slipping away from us.
I leave this task to you, my dear granddaughter, because you have always believed in the power of love to heal and transform. Perhaps you can succeed where I failed. Perhaps you can help these lost souls find their way back to each other.
All my love,
Grandma Rose"

Emma sank into the old leather chair behind the desk, overwhelmed by the magnitude of what her grandmother had entrusted to her. Forty-three letters, forty-three chances to reunite lost lovers, to heal old wounds, to prove that love could indeed conquer time and distance.

She picked up the first letter again, the one addressed to Margaret, and made a decision that would change not only her life but the lives of everyone whose words lay scattered across the desk. She was going to deliver these letters, every single one of them.

The adventure of a lifetime was about to begin.`,
      },
      {
        id: "3-2",
        title: "The First Delivery",
        content: `Margaret Whitmore lived in a cottage on the outskirts of town, surrounded by a garden that bloomed with the same wild abandon Emma remembered from her grandmother's stories. At seventy-eight, Margaret still moved with the grace of the dancer she had once been, though her silver hair and lined face spoke of decades lived fully.

Emma's heart pounded as she approached the front door, the forty-year-old letter clutched in her sweating palm. How do you explain to someone that you're delivering a message from their past? How do you prepare them for words that might reopen old wounds?

"Can I help you, dear?" Margaret asked when she answered the door, her blue eyes curious but kind.

"Mrs. Whitmore, my name is Emma Chen. I inherited my grandmother's bookshop, and I found something that belongs to you." Emma held out the letter with trembling hands. "It's from someone named Thomas."

The color drained from Margaret's face. She stared at the envelope as if it were a ghost, her hand rising unconsciously to her throat. "Thomas," she whispered. "Thomas Hartwell?"

"I believe so, yes. The letter was never sent, but I thought... I hoped you might want to read it."

Margaret's eyes filled with tears as she took the letter. "Please, come in. I think I need to sit down."

The cottage was filled with photographs—images of Margaret in her youth, dancing on stages across Europe, but Emma noticed that in none of them was she alone. A tall, dark-haired man appeared in many of the pictures, his arm around Margaret's waist, his eyes full of adoration.

"That's Thomas," Margaret said, noticing Emma's gaze. "We were engaged once, a lifetime ago. He was a musician, a pianist. We met in Paris when I was dancing with the ballet company there."

With shaking hands, Margaret opened the letter and began to read. Emma watched as emotions played across the older woman's face—surprise, pain, joy, and finally, a deep, abiding sadness.

"He says he never stopped loving me," Margaret whispered. "He says he tried to find me after the war, but I had already returned to America. He thought I had forgotten him, moved on with my life."

"Did you?" Emma asked gently.

Margaret laughed, but it was a sound filled with tears. "Forget Thomas? Oh, my dear, I married a good man, had children, built a life. But forget Thomas? Never. He was my first love, my greatest love. I always wondered what happened to him, why he never wrote."

"According to the postmark, this letter was written forty years ago," Emma said. "Mrs. Whitmore, he might still be alive. We could try to find him."

Margaret looked up with eyes that suddenly blazed with hope. "Do you really think so? After all these years?"

Emma smiled. "My grandmother always said it's never too late for love to find a way."

That evening, Emma sat at her laptop in the bookshop, searching for any trace of Thomas Hartwell. It took hours of digging through online records, social media, and genealogy sites, but finally, she found him. Thomas Hartwell, age eighty-one, living in a retirement community in Portland, Oregon. A widower, according to the records, with two grown children.

Her hands shook as she dialed the number. When a man's voice answered, cultured and warm despite his age, Emma took a deep breath.

"Mr. Hartwell? My name is Emma Chen, and I have a very unusual story to tell you. It's about a woman named Margaret, and a letter you wrote forty years ago..."

The silence on the other end of the line stretched so long that Emma wondered if the connection had been lost. Then, in a voice thick with emotion, Thomas Hartwell whispered, "Margaret? My Margaret? Is she... is she still alive?"

"She is, Mr. Hartwell. And she never forgot you either."

Three days later, Emma stood in the Portland airport, watching as an elderly man with silver hair and kind eyes walked slowly toward the arrival gate. Margaret had flown in that morning, and Emma had never seen anyone look so nervous and hopeful at the same time.

When Thomas saw Margaret, he stopped walking. For a moment, they simply stared at each other across the crowded terminal, seeing past the wrinkles and gray hair to the young lovers they had once been.

Then Margaret smiled—the same radiant smile Emma had seen in the old photographs—and Thomas began to walk faster. They met in the middle of the terminal, and when Thomas took Margaret's hands in his, Emma saw forty years of separation melt away in an instant.

"I never stopped loving you," Thomas said, his voice carrying clearly across the space between them.

"I know," Margaret replied, tears streaming down her face. "I read your letter."

As Emma watched them embrace, she felt her grandmother's presence beside her, warm and approving. One letter delivered, forty-two to go. But already, Emma knew that this was more than just a task her grandmother had left her—it was a calling, a chance to prove that love truly was the most powerful force in the universe.

The first reunion was complete, but Emma's journey as a messenger of love had only just begun.`,
      },
      {
        id: "3-3",
        title: "Love Finds a Way",
        content: `Six months later, Emma stood in the renovated bookshop, now bustling with activity. The "Love Letters Project," as the local newspaper had dubbed it, had captured the imagination of the entire town. People came from miles around to share their own stories of lost love, hoping Emma might work her magic for them too.

Of the forty-three letters she had inherited, Emma had successfully delivered thirty-eight. Some reunions had been joyful, like Margaret and Thomas, who had married in a small ceremony at the bookshop just two months after their reunion. Others had brought closure rather than romance—old wounds finally healed, forgiveness finally granted, peace finally found.

But it was the thirty-ninth letter that had changed Emma's life in ways she never expected.

The letter was addressed to "James Morrison, Architect," with an address in Seattle. The return address simply read "A. Parker." Emma had spent weeks tracking down James, only to discover that he lived just three blocks away from the bookshop, having moved to town five years earlier after his retirement.

James was a quiet man in his sixties, with gentle hands and eyes that held a deep sadness. When Emma showed him the letter, his reaction was unlike any she had witnessed before. He didn't cry or gasp or tremble. Instead, he smiled—a smile so full of love and loss that it took Emma's breath away.

"Anna," he said simply. "I wondered if she would ever write."

The letter, dated fifteen years earlier, was heartbreaking in its simplicity:

"My dearest James,
I know I have no right to contact you after what I did, after the choice I made. But I need you to know that leaving you was the hardest thing I ever did, and not a day has passed that I haven't regretted it. I was scared, James. Scared of how much I loved you, scared of the life we were building together. So I ran, like a coward, and broke both our hearts in the process.
I'm writing this from the hospital. The doctors say I don't have much time left, and I couldn't bear the thought of leaving this world without telling you the truth: you were the love of my life, and I was a fool to let you go.
I don't expect forgiveness. I don't even expect you to remember me fondly. I just needed you to know that you were loved, completely and utterly, by someone who was too afraid to show it when it mattered.
All my love, always,
Anna"

"She died sixteen years ago," James told Emma quietly. "Cancer. I found out through mutual friends, but by then it was too late. I always wondered if she ever thought of me, if she ever regretted the way things ended."

Emma felt tears streaming down her face. "I'm so sorry, Mr. Morrison. I wish I could have delivered this letter sooner."

James shook his head. "Don't be sorry, Emma. You've given me the greatest gift imaginable. For sixteen years, I've carried the pain of thinking Anna left because she didn't love me enough. Now I know the truth—she left because she loved me too much. That changes everything."

It was then that Emma noticed the young man who had been quietly shelving books in the corner of the shop. He was tall and lean, with dark hair and the same gentle eyes as James. He had been helping Emma with the bookshop for the past month, and she had found herself looking forward to his visits more than she cared to admit.

"Emma," James said, following her gaze, "I'd like you to meet my son, David. David, this is Emma, the woman I've been telling you about."

David Morrison stepped forward with a smile that made Emma's heart skip. "Actually, we've already met. I've been volunteering here for weeks, hoping to work up the courage to ask you out."

Emma stared at him in shock. "You're James's son? But why didn't you say anything?"

"Because I wanted you to get to know me for who I am, not as the son of one of your letter recipients," David replied. "But now that the secret's out... Emma Chen, would you like to have dinner with me?"

As Emma looked into David's eyes, she felt something she had been too busy to notice over the past months—the flutter of new love, the possibility of her own happy ending. She had spent so much time reuniting other people with their lost loves that she had almost missed the love that was growing right in front of her.

"Yes," she said, her voice barely above a whisper. "I would love to."

James clapped his hands together, his face beaming. "Well, this is perfect. Anna would have loved this—her letter bringing together not just the past, but the future as well."

As Emma closed the bookshop that evening, she reflected on the journey that had brought her here. She had started with forty-three letters and a mission to reunite lost lovers. She was ending with a thriving business, a community of friends, and the beginning of her own love story.

The last four letters remained undelivered, but Emma wasn't worried. Love, she had learned, had a way of finding its own path. Sometimes it needed a little help from a determined granddaughter with a box of old letters, but it always, always found a way.

Outside, David was waiting for her with a bouquet of roses and a smile that promised forever. As they walked hand in hand down Maple Street, Emma could swear she heard her grandmother's laughter on the evening breeze, approving and joyful.

The Love Letters Project would continue, but Emma's own love story was just beginning. And somewhere in the space between past and future, between memory and hope, love continued to work its magic, one letter at a time.`,
      },
    ],
  },
]
