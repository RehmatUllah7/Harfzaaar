import React, { useState } from "react";


import Header from "../Header";
import Footer from "@/components/home/footer";

const News = () => {
  const [selectedNews, setSelectedNews] = useState(null);

  const newsItems = [
    {
      id: 1,
      image: "/images/nasirKazmii.png",
      headline: "Nasir Kazmi's Journey Through Melancholy",
      description: "A poet who captured the essence of longing and solitude.",
      details: `Most of us know Nasir Kazmi by his ghazals, not by name. Very few among us would have missed his famous Ghulam Ali ghazal, ‘Dil mein ik lehar si uthi hai abhi’, or Nusrat Fateh Ali Khan’s ‘Gham hai ya khushi hai, tu meri zindagi hai tu’.

It is difficult to say who established Nasir Kazmi as a niche poet — the critics or the musicians. It is no mere coincidence that this Pakistani poet is the darling of almost every celebrated ghazal singer on both sides of the border. His poetry instantly strikes a responsive chord with a delicate mind: ‘Dil dhadakne ka sabab yaad aaya; vo teri yaad thi ab yaad aaya’, sung beautifully by Asha Bhosle.

Born in December 1925 at Ambala to a Subedar Major of the British Indian Army, he finished his matriculation from Muslim High School, and moved to Lahore for his college education. He came back to Ambala in 1945 and continued living there until 1947, when his family decided to migrate to Pakistan, where they settled in Lahore. Until his death in 1972, Lahore remained his favourite haunt, where he enjoyed the company of other men of letters and nightly sojourns in its historic streets.

Nasir is downright romantic, melancholic, a brooding loner in his poetry. In his nostalgia, he is a bridge that connects us to our pre-Partition past, a mirror that reflects our age-lines, a voice that we love to hear after the thunder of the day is done.`,
    },
    {
      id: 2,
      image: "/images/faiz.webp",
      headline: "Celebrating Faiz Ahmed Faiz's Literary Legacy",
      description: "Faiz's revolutionary poetry resonates to this day.",
      details: `During unspeakably dark moments, where do we turn? To facts? Beliefs? Or to someplace else? Facts organize the world, which we go mad to control. When we cling to our beliefs out of fear, they in turn dull our minds. But poetry, specifically that of the revolutionary poet, can both soothe our disquiet and awaken us to our complacency. Within the revolutionary poet’s words lies the potential not only to speak of our discontents, but also to bring us together, move us to action, and help us imagine how to create new futures.

This past month, we have been taking stock of the catastrophic loss that Donald Trump’s triumph has hollowed out among our nation’s people of color, among its minorities, among those who fear their further disenfranchisement and loss of voice. The night of the election, as I crawled into bed, unsure of what kind of America I’d wake up to, a slim volume of translated poems lay on my bedside table: verses written by the Urdu poet Faiz Ahmed Faiz.

In 1947, the British, hastening to grant the people of the Indian subcontinent their independence, split the region of Punjab between Hindus and Muslims so that each religious group could have their own state: India and Pakistan. Faiz documented the Indian subcontinent in the throes of uncertainty, tension, and horrific violence. Since the election, his poems, both nourishing and rousing, have kept me company as I’ve struggled to find words to articulate my anger, grief, and indignation at the nightmarish reality that awaits us.

Faiz was born in 1911 in Sialkot, from where my maternal grandmother also hailed, in a region of Punjab that sits along the fault line of Partition. His upbringing was Muslim, he was trained in the classical Persian poets Rumi and Hafiz, and he learned to read English, French, and Russian literature while growing up. He has achieved today an iconic legacy, his name carrying a distinctive ring that many Pakistanis hold within their hearts.

Faiz’s poetry has long reflected a syncretic spirit, both across place and across time. It found a place among many local cultural traditions and also beyond. He not only navigated the space between Hindu and Muslim, but was also deeply influenced by British poets like W.H. Auden. Faiz’s poetry merged styles across centuries, weaving together classical forms like the 14th-century ghazal (notably drawing from Punjabi poetic ideals like loss and longing, as well as from Sufi philosophy) with 20th-century forms like free verse that the British had been importing into the subcontinent since the Raj took hold of it a century earlier.

Moreover, that Faiz’s work responded to contemporary moments of crisis made his poetry distinctively critical in two ways. His verses both challenged structures of power and the failure of governments to heed the concerns of the downtrodden, and they reflected a new direction for poetry itself—a revolutionary one. Most importantly, Faiz adopted and adapted the forms, images, and themes of Urdu poetry to criticize and galvanize readers against the oppressive political regimes threatening the subcontinent while the British were drawing their line in the sand and splitting the land apart.

Faiz’s poems issue a social and collective call through their use of a universal hum (Hindi for “I” or “we”). His characteristic style of free verse, referred to as nazm within the Urdu poetic tradition, assumed a revolutionary aesthetic, opening for his readers new possibilities for becoming actors in—and on—the world. Nazm departs from the formal genre of ghazal, classical love poetry that either celebrates or mourns love. In the lyrical fervor of nazm, Faiz transformed emotion into motion, such that erotic poetry and revolutionary poetry blurred. Traditional tropes like devotion and separation, and peace and madness, became mobilizing forces for critiquing state oppression and for upholding an ethos that empowered the exploited to rise up. This is why we must take him up again in our present, paroxysmal moment.`,
    },
  ];

  // Function to truncate text to 200 words
  const truncateText = (text, wordLimit = 200) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <>
      {/* Header Component */}
      <Header />

      {/* News Section */}
      <section className="bg-gradient-to-r from-gray-900 via-black to-purple-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {newsItems.map((news) => (
              <div
                key={news.id}
                className="flex flex-col md:flex-row bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden"
              >
                {/* Left Side: Image and Description */}
                <div className="w-full md:w-1/2">
                  <img
                    src={news.image}
                    alt={news.headline}
                    className="w-full h-84 object-cover"
                  />
                  <div className="p-4 bg-gray-200">
                    <p className="text-gray-700 text-sm">{news.description}</p>
                  </div>
                </div>

                {/* Right Side: Headline and Details */}
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">{news.headline}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {truncateText(news.details)}
                  </p>
                  <button
                    onClick={() => setSelectedNews(news.id)}
                    className="mt-4 self-start bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-800 transition duration-300"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Details Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-2xl max-w-2xl w-full mx-4 animate-fadeIn max-h-[80vh] overflow-y-auto">
            {/* Close Button */}
            <button
              className="fixed z-20 top-2 right-2 text-white hover:text-red-600 transition duration-300"
              onClick={() => setSelectedNews(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* News Content */}
            {newsItems
              .filter((news) => news.id === selectedNews)
              .map((news) => (
                <div key={news.id}>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {news.headline}
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {news.details}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Footer Component */}
      <Footer />
    </>
  );
};

export default News;
