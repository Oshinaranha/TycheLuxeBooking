import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-20 bg-[#F4F4F4]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12"
          >
            <p className="text-[#D4AF37] font-cormorant text-xl uppercase tracking-widest mb-3">
              About Tyche Luxe
            </p>
            <h2 className="text-[#0D0D0D] text-3xl md:text-4xl font-playfair font-bold mb-6">
              Redefining Luxury Travel
            </h2>
            <p className="text-[#333333] mb-6">
              Named after Tyche, the Greek goddess of fortune and prosperity,
              Tyche Luxe embodies the essence of exclusive travel and
              extraordinary experiences.
            </p>
            <p className="text-[#333333] mb-6">
              Since our inception, we have been dedicated to providing
              discerning clients with unparalleled access to the world's most
              coveted luxury transportation. Our meticulously curated fleet of
              private jets, yachts, and exotic cars represents the pinnacle of
              engineering excellence and opulent design.
            </p>
            <p className="text-[#333333] mb-8">
              What truly sets us apart is our unwavering commitment to
              personalized service. Each journey is tailored to exceed your
              expectations, with every detail thoughtfully considered and
              flawlessly executed.
            </p>
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-[#D4AF37] text-3xl font-playfair font-bold">15+</p>
                <p className="text-[#333333]">Years of Excellence</p>
              </div>
              <div>
                <p className="text-[#D4AF37] text-3xl font-playfair font-bold">200+</p>
                <p className="text-[#333333]">Luxury Vehicles</p>
              </div>
              <div>
                <p className="text-[#D4AF37] text-3xl font-playfair font-bold">5000+</p>
                <p className="text-[#333333]">Satisfied Clients</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 grid grid-cols-2 gap-4"
          >
            <div className="rounded-lg overflow-hidden h-64">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LWxpZmVzdHlsZXx8fHx8fDE3MTY1MDYyNTM&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080"
                alt="Luxury lifestyle"
                className="object-cover h-full w-full hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-lg overflow-hidden h-64">
              <img
                src="https://images.unsplash.com/photo-1560507074-b9eb43faab00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LXlhY2h0c3x8fHx8fDE3MTY1MjgxNDA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080"
                alt="Luxury yacht interior"
                className="object-cover h-full w-full hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-lg overflow-hidden h-64">
              <img
                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LWNhcnN8fHx8fHwxNzE2NTA2MjAx&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080"
                alt="Luxury car"
                className="object-cover h-full w-full hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-lg overflow-hidden h-64">
              <img
                src="https://images.unsplash.com/photo-1548430395-ec39eaf2aa1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LXByaXZhdGUtamV0c3x8fHx8fDE3MTY1MDYzMDA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080"
                alt="Private jet cabin"
                className="object-cover h-full w-full hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
