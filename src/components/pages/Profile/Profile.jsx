import { useAuth0 } from '@auth0/auth0-react';
import './profile.css';
function Profile() {
  const { user, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      <div className="profile-container">
        <p>{user.name}</p>
        {user?.picture && <img src={user.picture} alt={user?.name} />}
        {user?.email && <p>{user.email}</p>}
      </div>
    )
  );
}

export default Profile;
