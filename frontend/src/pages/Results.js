import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar } from 'recharts';

const Results = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user?.username) return;
      setLoading(true);
      try {
        const res = await fetch(`https://mental-wellness-production.up.railway.app/analytics/${encodeURIComponent(user.username)}`);
        const data = await res.json();
        setAnalytics(data);
      } catch (e) {
        console.error('Failed to load analytics:', e);
        setAnalytics({ hasEnoughData: false, conversationCount: 0 });
      }
      setLoading(false);
    };
    loadAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your wellness insights...</p>
      </div>
    );
  }

  if (!analytics?.hasEnoughData) {
    return (
      <div className="p-6 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-4xl mb-4">💬</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Keep Chatting to See Results!</h2>
          <p className="text-gray-600 mb-4">{analytics?.message}</p>
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full ${
                    i < (analytics?.conversationCount || 0) ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {analytics?.conversationCount || 0}/3 conversations
            </span>
          </div>
          <p className="text-sm text-blue-600">Visit the Chat page to continue your wellness journey!</p>
        </div>
      </div>
    );
  }

  const { overview, stressDistribution, stressTrend, recentSuggestions, insights, conversationCount } = analytics;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Wellness Journey</h1>
        <p className="text-gray-600">
          Based on {conversationCount} conversations • Average stress level: {Math.round(overview?.avgStress || 0)}/100
        </p>
      </div>

      {/* Key Insights Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{conversationCount}</div>
            <div className="text-sm text-gray-600">Total Conversations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{insights?.averageStressCategory}</div>
            <div className="text-sm text-gray-600">Average Stress Level</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${insights?.improvement === 'improving' ? 'text-green-600' : 'text-orange-600'}`}>
              {insights?.improvement === 'improving' ? '📈 Improving' : '📋 Monitor'}
            </div>
            <div className="text-sm text-gray-600">Trend Status</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Stress Distribution Pie Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🥧 Stress Level Distribution</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={stressDistribution} 
                  dataKey="value" 
                  nameKey="label" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100}
                  label={({label, value}) => `${label}: ${value}`}
                >
                  {stressDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stress Trend Line Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Stress Trend Over Time</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={stressTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="chatNumber" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}/100`, 'Stress Level']}
                  labelFormatter={(label) => `Conversation #${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="stressLevel" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent AI Suggestions */}
      {recentSuggestions && recentSuggestions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Recent Wellness Suggestions</h3>
          <div className="space-y-3">
            {recentSuggestions.slice(0, 3).map((suggestion, index) => (
              <div key={index} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-800">{suggestion.suggestion}</p>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                      <span>Stress Level: {suggestion.stressLevel}/100</span>
                      <span>{new Date(suggestion.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={`ml-4 px-2 py-1 rounded text-xs font-medium ${
                    suggestion.stressLevel < 25 ? 'bg-green-100 text-green-800' :
                    suggestion.stressLevel < 50 ? 'bg-yellow-100 text-yellow-800' :
                    suggestion.stressLevel < 75 ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {suggestion.stressLevel < 25 ? 'Low' :
                     suggestion.stressLevel < 50 ? 'Moderate' :
                     suggestion.stressLevel < 75 ? 'High' : 'Very High'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;