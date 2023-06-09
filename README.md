<div align="center">
  <img src="https://raw.githubusercontent.com/zivattias/Homey/main/client/src/assets/logo.png" width="200px" />
</div>

Homey is a versatile end-to-end web application aimed at addressing the housing crisis in Tel-Aviv. The application allows users to both view and post property listings, and facilitates communication between listing-owners and tenants to explore potential housing options.

Homey is written in **Python** and **TypeScript** (React), and hosted on **AWS (RDS, EC2, S3)**.

> **Note:** The project is still a work in progress.

## 🧩 Features

-   Backend:
-   [x] PostgreSQL database
-   [x] Django-based REST API
-   [x] JSON Web Token authentication
-   [x] Custom permissions per Model/Serializer
-   [ ] Data fetch from Meta Graph API & web crawling

---

-   Frontend:
-   [x] Material UI React components
-   [x] Dark/light mode theme
-   [x] Local storage utilization for automatic login (refresh token as HTTPOnly cookie - _WIP_)
-   [ ] AI implementation for enhanced entities search
-   [ ] Real-time messaging app between users

## 🧱 Built Using

-   [Django](https://github.com/django/django) - Web framework for Python
-   [DRF](https://github.com/encode/django-rest-framework) - REST API for Django
-   [SimpleJWT](https://github.com/jazzband/djangorestframework-simplejwt) - JSON Web Token library
-   [React](https://github.com/facebook/react) - User interface framework
-   [react-router-dom](https://github.com/remix-run/react-router) - Declarative routing for React
-   [React Query](https://github.com/TanStack/query) - Asynchronous state management, server-state utilities and data fetching for the web
-   [lottie-react](https://github.com/Gamote/lottie-react) - Lightweight React lib for rendering JSON-based animations
-   [Vest](https://github.com/ealush/vest) - Declarative validations framework

## ⚖️ License

MIT License - see the `LICENSE` file for details.
