import { CollaborationPanel } from '@udp/ui';
import { useEffect, useState } from 'react';

// Mock users for demonstration
const mockUsers = [
  {
    id: 'user1',
    name: 'Alice Johnson',
    color: '#FF6B6B',
    isActive: true,
    lastSeen: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    cursor: { line: 15, column: 8 }
  },
  {
    id: 'user2', 
    name: 'Bob Smith',
    color: '#4ECDC4',
    isActive: true,
    lastSeen: new Date(Date.now() - 1000 * 30), // 30 seconds ago
    cursor: { line: 23, column: 12 }
  },
  {
    id: 'user3',
    name: 'Carol Davis',
    color: '#45B7D1',
    isActive: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    id: 'user4',
    name: 'David Wilson',
    color: '#96CEB4',
    isActive: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 'currentUser',
    name: 'You',
    color: '#FFEAA7',
    isActive: true,
    lastSeen: new Date(),
    cursor: { line: 1, column: 1 }
  }
];

export default function PresenceDemo() {
  const [users, setUsers] = useState(mockUsers);
  const [currentUserId] = useState('currentUser');

  // Simulate user activity changes
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(currentUsers => {
        return currentUsers.map(user => {
          // Randomly toggle activity for non-current users
          if (user.id !== currentUserId && Math.random() < 0.1) {
            const newLastSeen = user.isActive 
              ? new Date(Date.now() - Math.random() * 1000 * 60 * 30) // Random time up to 30 min ago
              : new Date(Date.now() - Math.random() * 1000 * 60); // Random time up to 1 min ago
            
            return {
              ...user,
              isActive: !user.isActive,
              lastSeen: newLastSeen,
              cursor: user.isActive ? undefined : {
                line: Math.floor(Math.random() * 50) + 1,
                column: Math.floor(Math.random() * 80) + 1
              }
            };
          }
          
          // Update lastSeen for active users occasionally
          if (user.isActive && Math.random() < 0.3) {
            return {
              ...user,
              lastSeen: new Date(Date.now() - Math.random() * 1000 * 60), // Up to 1 minute ago
              cursor: {
                line: Math.floor(Math.random() * 50) + 1,
                column: Math.floor(Math.random() * 80) + 1
              }
            };
          }
          
          return user;
        });
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [currentUserId]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#333',
          marginBottom: '1rem'
        }}>
          Enhanced Presence System Demo
        </h1>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#666',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          This demo showcases the enhanced presence indicators and collaboration panel.
          User activity will simulate randomly to demonstrate real-time updates.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 320px',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Main Content Area */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            padding: '24px'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#333',
              marginBottom: '1rem'
            }}>
              Collaborative Editor Area
            </h2>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              padding: '16px',
              minHeight: '400px',
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              <div style={{ color: '#666', marginBottom: '12px' }}>
                {/* Sample collaborative code editor */}
              </div>
              <div style={{ color: '#333' }}>
                function calculateSum(a, b) {'{'}
              </div>
              <div style={{ color: '#333', paddingLeft: '20px' }}>
                return a + b;
              </div>
              <div style={{ color: '#333' }}>
                {'}'}
              </div>
              <br />
              <div style={{ color: '#666' }}>
                {/* Users are collaborating on this code... */}
              </div>
              <div style={{ color: '#333' }}>
                const result = calculateSum(5, 3);
              </div>
              <div style={{ color: '#333' }}>
                console.log(result);
              </div>
            </div>

            <div style={{ 
              marginTop: '16px', 
              fontSize: '14px', 
              color: '#666' 
            }}>
              💡 In a real editor, you would see user cursors and selections in real-time
            </div>
          </div>

          {/* Collaboration Panel */}
          <div>
            <CollaborationPanel
              users={users}
              currentUserId={currentUserId}
              autoCollapseDelay={60000}
            />
            
            <div style={{ 
              marginTop: '16px',
              padding: '12px',
              backgroundColor: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#666'
            }}>
              <strong>Demo Features:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '16px' }}>
                <li>Real-time presence indicators</li>
                <li>Activity status updates</li>
                <li>User grouping (Active/Recently Active)</li>
                <li>Activity feed with timestamps</li>
                <li>Collapsible interface</li>
                <li>Auto-refreshing user status</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '32px',
          padding: '16px',
          backgroundColor: '#e8f5e8',
          border: '1px solid #a3d977',
          borderRadius: '6px'
        }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: '600', 
            color: '#2d5a0d',
            margin: '0 0 8px 0'
          }}>
            ✅ Priority 5: Enhanced Presence Indicators - Complete!
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#2d5a0d',
            margin: 0,
            lineHeight: '1.5'
          }}>
            This completes the final priority from our immediate wins roadmap. The enhanced presence system 
            provides better visual indicators, real-time status updates, activity feeds, and improved 
            collaboration awareness for both web and mobile platforms.
          </p>
        </div>
      </div>
    </div>
  );
}