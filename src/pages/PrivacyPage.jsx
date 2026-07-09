function PrivacyPage() {
  return (
    <div className="flex flex-col items-center pt-16 px-6 pb-16 gap-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-parchment">Privacy policy</h1>

      <div className="text-parchment/70 leading-relaxed flex flex-col gap-4">
        <p>
          Takhayul stores the information needed to run your account: your email,
          favorites, ratings, search history, and taste preferences. This data is
          stored securely and is only accessible to you.
        </p>
        <p>
          We do not sell your data or share it with third parties for advertising.
        </p>
        <p>
          Your search queries and activity are used only to power your personal
          recommendations within the app.
        </p>
        <p>
          You can delete your favorites, ratings, or account data at any time by
          contacting the site owner.
        </p>
        <p>
          Takhayul is a personal learning project, not a commercial product, and
          data handling practices may be less formal than a large company's. Please
          use your own judgment about what information you share.
        </p>
      </div>
    </div>
  )
}

export default PrivacyPage