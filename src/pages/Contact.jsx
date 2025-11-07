// src/pages/Contact.js  (pas dans components/)
const Contact = () => {
    return (
        <main className="pt-[72px] min-h-[calc(100vh-72px)]">
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-center mb-12">
                    Me <span className="text-purple-400">contacter</span>
                </h1>
                <form className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500"
                            placeholder="votre@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Message</label>
                        <textarea
                            rows="5"
                            className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                        Envoyer
                    </button>
                </form>
            </section>
        </main>
    );
};

export default Contact;
