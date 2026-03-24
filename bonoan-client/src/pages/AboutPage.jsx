import Button from '../components/Button';
import logo from '../assets/images/SolarisLogoWht.png';

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-10 min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">

      {/* HERO SECTION */}
      <section className="border-y-2 border-orange-600 px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* TEXT */}
          <div>
            <p className="text-orange-400 text-xs uppercase tracking-[0.3em]">
              About
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Solaris Studio
            </h1>

            <p className="mt-5 text-gray-300 leading-7">
              Solaris Studio is shaped by light, contrast, and intention—where ideas are not rushed, but formed with precision and quiet confidence.
              It reflects the balance between structure and creativity, where every element exists with purpose.
            </p>

            <p className="mt-4 text-gray-400 text-sm">
              A space where vision is refined into form, and design becomes something both functional and expressive.
            </p>

            <div className="mt-6">
              <Button
                to="/"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-red-600 hover:to-orange-500 text-white shadow-lg transform hover:scale-105 transition-all"
              >
                Back Home
              </Button>
            </div>
          </div>

          {/* IMAGE */}
          <div className="rounded-3xl border-2 border-orange-600 p-4 shadow-2xl hover:scale-105 transition-all">
            <div className="w-full aspect-[4/3] overflow-hidden rounded-xl">
              <img
                src={logo}
                alt="About"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* CARDS */}
      <section className="px-6 pb-10">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Our Mission", text: "To shape ideas into clear visual systems that feel intentional, balanced, and timeless." },
            { title: "Our Vision", text: "To create a design foundation where creativity flows naturally within structured clarity." },
            { title: "Our Approach", text: "We build with restraint, letting spacing, contrast, and hierarchy guide the experience." }
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-3xl border-2 border-orange-600 p-6 bg-gradient-to-br from-gray-800 to-black shadow-xl hover:-translate-y-2 hover:scale-105 transition-all"
            >
              <h3 className="text-xl font-semibold text-orange-400">
                {item.title}
              </h3>
              <p className="mt-4 text-gray-300 text-sm leading-6">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECOND IMAGE SECTION */}
      <section className="border-y-2 border-orange-600 px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <div className="w-full aspect-[4/3]">
              <img
                src="https://img.freepik.com/premium-photo/fiery-galaxy-background-with-red-nebula_1170794-158238.jpg"
                alt="Work"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-orange-400">
              Designed with purpose
            </h2>

            <p className="mt-4 text-gray-300 leading-7">
              Every section is composed with intention—guided by spacing, alignment, and contrast to create visual harmony.
            </p>

            <p className="mt-4 text-gray-400 text-sm">
              The result is a system that feels both minimal and expressive, where clarity leads and noise is removed.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutPage;