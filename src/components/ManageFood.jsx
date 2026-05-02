import { useEffect, useState } from 'react';
import { get, post } from '../api';

export default function ManageFood() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [type, setType] = useState('VEG');
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, itemsData] = await Promise.all([
          get('/food/categories'),
          get('/food/items')
        ]);
        setCategories(categoriesData);
        setItems(itemsData);
      } catch (error) {
        console.error('Failed to fetch food data:', error);
      }
    };
    fetchData();
  }, []);

  const addCategory = async () => {
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    setLoading(true);
    try {
      const added = await post('/food/categories', { type, category: categoryName });
      setCategories(prev => [...prev, added]);
      setCategoryName('');
      alert('Category added successfully!');
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!selectedCategory || !itemName.trim()) {
      alert('Please select a category and enter an item name');
      return;
    }
    
    setLoading(true);
    try {
      const added = await post('/food/items', { category_id: selectedCategory, name: itemName });
      setItems(prev => [...prev, added]);
      setItemName('');
      alert('Item added successfully!');
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    const categoryKey = `${item.type} - ${item.category_name}`;
    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }
    acc[categoryKey].push(item);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Manage Food Items</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Add Category Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <span className="mr-2">🏷️</span>
            Add Food Category
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Food Type</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)} 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="VEG">🥬 Vegetarian</option>
                <option value="NONVEG">🍖 Non-Vegetarian</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Category Name</label>
              <input 
                value={categoryName} 
                onChange={e => setCategoryName(e.target.value)} 
                placeholder="e.g., Chapati, Rice, Curry" 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <button 
              onClick={addCategory} 
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </div>

        {/* Add Item Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <span className="mr-2">🍽️</span>
            Add Food Item
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Select Category</label>
              <select 
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)} 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a category...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.type === 'VEG' ? '🥬' : '🍖'} {c.category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Item Name</label>
              <input 
                value={itemName} 
                onChange={e => setItemName(e.target.value)} 
                placeholder="e.g., Atta Chapati, Basmati Rice" 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button 
              onClick={addItem} 
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </div>
      </div>

      {/* Existing Items Display */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
          <span className="mr-2">📋</span>
          Current Food Items
        </h3>
        
        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg">No food items added yet</div>
            <div className="text-sm mt-2">Start by adding categories and items above</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">
                    {categoryItems[0]?.type === 'VEG' ? '🥬' : '🍖'}
                  </span>
                  {category}
                </h4>
                <div className="space-y-2">
                  {categoryItems.map(item => (
                    <div key={item.id} className="bg-gray-50 px-3 py-2 rounded text-sm">
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
