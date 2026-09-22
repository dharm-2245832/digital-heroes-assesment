export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8 mt-20">
        <h1 className="text-4xl font-bold tracking-tight">How It Works</h1>
        <div className="space-y-6 text-gray-400">
          <p>1. <strong>Subscribe:</strong> Join our platform with a monthly or yearly subscription.</p>
          <p>2. <strong>Track:</strong> Log your golf scores. We keep your latest 5 scores on record.</p>
          <p>3. <strong>Give:</strong> Select a charity from our directory. At least 10% of your fee goes directly to them.</p>
          <p>4. <strong>Win:</strong> Every month, a draw takes place. If your 5 stored scores match the drawn numbers, you win a share of the prize pool!</p>
        </div>
      </div>
    </div>
  );
}
