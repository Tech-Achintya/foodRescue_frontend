import { useState, useEffect } from 'react';
import { get, post } from '../api';

export default function Feedback({ user }) {
  const [acceptedPackages, setAcceptedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchAcceptedPackages = async () => {
      try {
        setLoading(true);
        const allPackages = await get('/packages');
        console.log('All packages:', allPackages); // Debug log
        
        // Show all accepted packages by this NGO, including rated ones
        const ngoAcceptedPackages = allPackages.filter(pkg => {
          console.log('Checking package:', pkg.id, pkg.status, pkg.accepted_by, user.id); // Debug log
          return pkg.status === 'ACCEPTED' && pkg.accepted_by == user.id; // Using loose equality for type conversion
        });
        
        console.log('NGO accepted packages:', ngoAcceptedPackages); // Debug log
        setAcceptedPackages(ngoAcceptedPackages);
      } catch (error) {
        console.error('Failed to fetch accepted packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedPackages();
  }, [user.id]);

  const handleRatingSubmit = async (packageId, rating, comment) => {
    try {
      setSubmitting(true);
      await post(`/packages/${packageId}/feedback`, {
        rating,
        comment,
        ngo_id: user.id
      });
      // Update the package in the list instead of removing it
      setAcceptedPackages(prev => prev.map(pkg => 
        pkg.id === packageId 
          ? { ...pkg, rating: rating, feedback: comment }
          : pkg
      ));
      setMessage({ text: 'Thank you for your feedback!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setMessage({ text: 'Failed to submit feedback. Please try again.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const backgroundStyle = {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
    minHeight: '100vh',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    position: 'relative',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(#8DBFC3 0.5px, transparent 0.5px), radial-gradient(#A8E0A3 0.5px, transparent 0.5px)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 10px 10px',
    opacity: 0.1,
    pointerEvents: 'none',
  };

  if (loading) {
    return (
      <div style={backgroundStyle} className="p-4 md:p-6">
        <div style={overlayStyle}></div>
        <div className="flex items-center justify-center h-48 bg-white/50 rounded-xl backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8DBFC3] mb-3"></div>
            <div className="text-[#5B7A83] font-medium">Loading packages...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={backgroundStyle} className="p-4 md:p-6">
      <div style={overlayStyle}></div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 relative">
        <div>
          <h2 className="text-2xl font-bold text-[#2C4A4E] flex items-center gap-2">
            <span className="text-3xl">⭐</span> Rate & Feedback
          </h2>
          <p className="text-[#5B7A83] mt-1">Rate the food packages you've accepted</p>
        </div>
      </div>

      {message.text && (
        <div className={`${message.type === 'success' ? 'bg-green-100 border-green-200 text-green-800' : 'bg-red-100 border-red-200 text-red-800'} px-4 py-3 rounded-lg mb-6 flex items-center border`}>
          <span className="mr-2">{message.type === 'success' ? '✅' : '❌'}</span> {message.text}
        </div>
      )}

      {acceptedPackages.length === 0 ? (
        <div className="bg-white/80 rounded-xl shadow-md backdrop-blur-sm p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <div className="text-[#2C4A4E] text-xl font-semibold mb-2">No packages to rate</div>
          <div className="text-[#5B7A83] max-w-md mx-auto">
            You've rated all the packages you've accepted. Thank you for your feedback!
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {acceptedPackages.map((pkg) => (
            <PackageRatingCard 
              key={pkg.id} 
              pkg={pkg} 
              onSubmit={handleRatingSubmit} 
              submitting={submitting}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PackageRatingCard({ pkg, onSubmit, submitting }) {
  // Initialize with existing rating and feedback if available
  const [rating, setRating] = useState(pkg.rating || 0);
  const [comment, setComment] = useState(pkg.feedback || '');
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="bg-white/90 rounded-xl shadow-md backdrop-blur-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#A8E0A3]/80 to-[#8DBFC3]/80 p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-[#2C4A4E] flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-white/80 h-6 w-6 rounded-full text-xs">
              📦
            </span>
            {pkg.package_code}
          </h3>
          {pkg.rating > 0 && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium border border-yellow-200">
              ⭐ Rated
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3 text-[#5B7A83]">
          <span className="text-sm">📍</span>
          <span className="font-medium">{pkg.hostel_name}</span>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-[#2C4A4E] mb-2 flex items-center gap-1">
            <span className="text-sm">🍽️</span> Items:
          </h4>
          <div className="flex flex-wrap gap-2">
            {pkg.items && pkg.items.map((item, index) => (
              <span key={index} className="bg-[#EEF2E0] px-2.5 py-1 rounded-lg text-sm text-[#5B7A83] border border-[#C9EAB0]/30">
                {item.food_name} ({item.quantity})
              </span>
            ))}
          </div>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          if (rating === 0) return;
          onSubmit(pkg.id, rating, comment);
        }} className="mt-4">
          <div className="mb-4">
            <label className="block text-[#2C4A4E] font-medium mb-2">Rate this package:</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl focus:outline-none"
                >
                  {star <= (hoverRating || rating) ? "★" : "☆"}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor={`comment-${pkg.id}`} className="block text-[#2C4A4E] font-medium mb-2">
              Comments (optional):
            </label>
            <textarea
              id={`comment-${pkg.id}`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DBFC3]"
              rows="3"
              placeholder="Share your experience with this package..."
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={rating === 0 || submitting}
            className={`w-full py-2 px-4 rounded-lg font-medium ${
              rating === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#8DBFC3] text-white hover:bg-[#7BAEB2] transition-colors'
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Submitting...
              </span>
            ) : (
              pkg.rating ? 'Update Rating' : 'Submit Rating'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}