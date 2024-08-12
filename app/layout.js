"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = ["/images/nflogo.png", "/images/XFL.png", "/images/CFL.png"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <html lang="en">
      <body className={inter.className} style={styles.body}>
        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={styles.imageWrapper}>
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Logo"
                  style={{
                    ...styles.logo,
                    opacity: index === currentImageIndex ? 1 : 0,
                    zIndex: index === currentImageIndex ? 2 : 1,
                    position: "absolute",
                    transition: "opacity 1s ease-in-out",
                  }}
                />
              ))}
            </div>
            <div style={styles.logoText}>Everything Football</div>
          </div>
          {/* <nav style={styles.nav}>
            <a href="/" style={styles.navLink}>Home</a>
            <a href="/explore" style={styles.navLink}>Explore More</a>
            <a href="/contact" style={styles.navLink}>Contact Us</a>
          </nav> */}
        </header>
        <main style={styles.main}>
          <section style={styles.hero}>
            <div style={styles.heroContent}>
              <h1 style={styles.heroTitle}>Welcome...</h1>
              <p style={styles.heroSubtitle}>
                Everything you need to know about football in one place
              </p>
              <button style={styles.heroButton}>Get Started</button>
            </div>
            <div style={styles.heroImageContainer}>
              <img
                src={images[currentImageIndex]}
                alt="Football Stats"
                style={{
                  ...styles.heroImage,
                  opacity: currentImageIndex === 0 ? 1 : 0.5,
                  transition: "opacity 1s ease-in-out",
                }}
              />
            </div>
          </section>
          {children}
        </main>
        <footer style={styles.footer}>
          <p>© 2024 Football Analytics. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}

const styles = {
  body: {
    margin: 0,
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#F4F7FB",
  },
  header: {
    backgroundColor: "#1A2B4C",
    padding: "20px 40px",
    color: "white",
    display: "flex",
    justifyContent: "center", // Center the header content
    alignItems: "center",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  imageWrapper: {
    position: "relative",
    width: "50px",
    height: "50px",
  },
  logo: {
    width: "100%",
    marginRight: "10px",
  },
  logoText: {
    fontSize: "28px",
    fontWeight: "bold",
    marginLeft: "10px", // Adjusted to avoid overlap with the logo
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#336699",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  main: {
    padding: "60px 40px",
    minHeight: "70vh",
  },
  hero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "40px 0",
  },
  heroContent: {
    maxWidth: "600px",
  },
  heroTitle: {
    fontSize: "48px",
    color: "#1A2B4C",
    marginBottom: "20px",
  },
  heroSubtitle: {
    fontSize: "24px",
    color: "#333333",
    marginBottom: "30px",
  },
  heroButton: {
    backgroundColor: "#336699",
    color: "white",
    border: "none",
    padding: "15px 30px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "18px",
  },
  heroImageContainer: {
    flex: 1,
    textAlign: "right",
  },
  heroImage: {
    width: "100%",
    maxWidth: "500px",
    transition: "opacity 1s ease-in-out",
  },
  footer: {
    backgroundColor: "#1A2B4C",
    padding: "20px 0",
    color: "white",
    textAlign: "center",
  },
};
