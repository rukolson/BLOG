
# Blog App (MERN Stack)

## Opis projektu
**Blog App** to aplikacja webowa oparta na technologii **MERN** (MongoDB, Express.js, React.js, Node.js). Aplikacja umożliwia użytkownikom rejestrację, logowanie, tworzenie, edytowanie i usuwanie wpisów blogowych. Zawiera również mechanizm uwierzytelniania przy użyciu **JWT** (JSON Web Token) oraz obsługę **API RESTful**.

## Funkcjonalności
- **Rejestracja i logowanie** użytkowników.
- **Tworzenie, edycja i usuwanie** postów blogowych.
- **Wyświetlanie postów** innych użytkowników.
- **Bezpieczne uwierzytelnianie** z wykorzystaniem JWT.
- **Interaktywne UI** oparte na React.js.

## Technologie
- **Frontend**: React.js, Context API, CSS
- **Backend**: Node.js, Express.js
- **Baza danych**: MongoDB
- **Uwierzytelnianie**: JSON Web Token (JWT)

## Wymagania systemowe
- **Node.js** (wersja 14 lub wyższa)
- **MongoDB** (wersja 4.4 lub wyższa)

## Instalacja

### Klonowanie repozytorium
Aby rozpocząć pracę, sklonuj repozytorium:
```bash
git clone https://github.com/twoj-uzytkownik/blog-app-mern.git
cd blog-app-mern
```

### Instalacja zależności
Zainstaluj zależności dla **backendu** i **frontendu**.

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### Konfiguracja plików `.env`

1. **Backend**:  
   W katalogu `server` utwórz plik `.env` i dodaj:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

2. **Frontend**:  
   W katalogu `client` utwórz plik `.env` z następującą zawartością:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

### Uruchomienie aplikacji

- **Backend**:
  ```bash
  cd server
  npm start
  ```

- **Frontend**:
  ```bash
  cd ../client
  npm start
  ```

### Dostęp do aplikacji
Aplikacja będzie dostępna pod adresem:  
[http://localhost:3000](http://localhost:3000)

## Struktura projektu
```
blog-app-mern/
|-- client/        # Kod frontendowy (React.js)
|-- server/        # Kod backendowy (Node.js, Express.js)
|-- README.md      # Dokumentacja projektu
```

## Przyszłe funkcjonalności
- **Dodawanie komentarzy do postów**
- **Obsługa kategorii i tagów dla postów**
- **Zaawansowane filtrowanie i wyszukiwanie postów**

## Licencja
Projekt jest objęty licencją **MIT**. Szczegóły znajdują się w pliku **LICENSE**.

## Autorzy
Projekt został zrealizowany przez:
- **Natalię Piankowską**
- **Nikolę Ruczyńską**
