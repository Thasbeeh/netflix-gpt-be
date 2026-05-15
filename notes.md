# Netflix-gpt be

- Local strategy guard
- Jwt strategy guard
- Refresh guard
- Centralised token service
- Signup
- login
- Refresh
- Logout
- Installed axios and registered HTTP Module
- Fetch Now playing movies using TMDB API
- Fetch Trailer video using Movie id with retry mechanism
- Central service to fetch data from tmdb
- Fetch Popular, trending, top rated movies
- Identify genre ids for moderation
- Family friendly content moderation service and made custom url with filter params
- Integrated Groq API and TMDB for AI enabled search

# Notes

- firstValueFrom: covert rxjs(stream of data) to promise(single data)

# Movies Fetch decision

- Initial load fetch now playing movies list
- Extract first movie id
- Fetch Trailer of first movie
- Send back NowPlayingMovies & Trailer
- Secondly, Fetch Popular, TopRated & Upcoming movies list
- Send back the lists

# Decision

Why axios interceptors?

- Request and response handling can be easily done with axios interceptors
- If token exist, token can be attached in request header from interceptor
- If error response has error, we can send token refresh request from response interceptor.

Why redux toolkit for token storage?

- Token can be stored in localStorage, but vulnarebale to XSS attack
- Token can be stored in React Context, but Contexts are available inside React only. Meanwhile axios interceptors lies outside react. Thus useContext() cannot be used.
  -- If I stick on Contexts, I have to create a module/ref/replica of actual token, to use outside React.
  -- It has inconsistency risk, because token is no more a single source of truth - One original and one replica/ref will be there.
- Thus, redux is used, which can make use in axios interceptors. Because both axios & RTK lies outside react.

How do you persist auth state without Firebase?
Answer:
“I treat the backend as the source of truth. On app load, I call a protected /me endpoint. If the access token is expired, I use a refresh token stored in an HTTP-only cookie to obtain a new one. Redux only mirrors the authenticated user state—it’s not the source of truth.”
