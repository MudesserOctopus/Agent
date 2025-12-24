import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h1 className="text-5xl font-bold mb-4">
          Build & Deploy AI Agents Faster
        </h1>
        <p className="text-xl max-w-2xl mb-8">
          Create, orchestrate, and scale intelligent AI workflows for your business — no code needed.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/CreateAgent"
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Create Agent
          </Link>
          <a
            href="#features"
            className="px-6 py-3 border border-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Core Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "No-Code Builder", desc: "Design intelligent agents with intuitive UI — no programming required." },
              { title: "Multi‑Agent Workflows", desc: "Orchestrate teams of AI agents to automate complex tasks." },
              { title: "Deploy Anywhere", desc: "Embed agents into websites, apps, or workflows instantly." },
            ].map((feature, i) => (
              <div key={i} className="p-6 border rounded-xl hover:shadow-lg transition">
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-indigo-600 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">
          Ready to launch your AI agents?
        </h3>
        <p className="mb-8">
          Start building today and accelerate your business automation.
        </p>
        <a
          href="#"
          className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition"
        >
          Sign Up Free
        </a>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </main>
  );
}