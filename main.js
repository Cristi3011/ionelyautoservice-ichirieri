// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField, query, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkcDsOF6IUdN6pZtvfTb2tO6JqsJ35e0I",
  authDomain: "inchirieri-auto-ionely.firebaseapp.com",
  projectId: "inchirieri-auto-ionely",
  storageBucket: "inchirieri-auto-ionely.appspot.com",
  messagingSenderId: "963502749420",
  appId: "1:963502749420:web:5f7ca3507061204abc17c9",
  measurementId: "G-Q3KHH0KB11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

    document.addEventListener('DOMContentLoaded', () => {
      const selectedCarParagraph = document.getElementById('selectedCar');
      const carImage = document.getElementById('car-image');
      const car1Button = document.getElementById('loganalbastru');
      const car2Button = document.getElementById('loganalb');
      const startDateInput = document.getElementById('dataincepere');
      const endDateInput = document.getElementById('datafinal');
      const rentButton = document.getElementById('rentbutton');
    
      const carImages = {
        'Logan Albastru': 'images/image3.png',
        'Logan Alb': 'images/image4.png'
      };
    
      if (car1Button) {
        car1Button.addEventListener('click', () => {
          const selectedCar = 'Logan Albastru';
          localStorage.setItem('selectedCar', selectedCar);
          if (selectedCarParagraph) {
            selectedCarParagraph.textContent = `Masina selectata: ${selectedCar}`;
          }
          window.location.href = 'formular.html';
        });
      }
    
      if (car2Button) {
        car2Button.addEventListener('click', () => {
          const selectedCar = 'Logan Alb';
          localStorage.setItem('selectedCar', selectedCar);
          if (selectedCarParagraph) {
            selectedCarParagraph.textContent = `Masina selectata: ${selectedCar}`;
          }
          window.location.href = 'formular.html';
        });
      }
    
      if (selectedCarParagraph) {
        const selectedCar = localStorage.getItem('selectedCar') || 'niciuna';
        selectedCarParagraph.textContent = `Masina selectata: ${selectedCar}`;
        if (selectedCar !== 'niciuna' && carImage) {
          carImage.src = carImages[selectedCar];
          carImage.style.display = 'block';
        }
      }
    
      if (startDateInput && endDateInput) {
        const today = new Date().toISOString().split('T')[0];
        startDateInput.setAttribute('min', today);
        endDateInput.setAttribute('min', today);
        blockReservedDates();
      }
    
      if (rentButton) {
        rentButton.addEventListener('click', async (e) => {
          const nume = document.getElementById('nume').value;
          const prenume = document.getElementById('prenume').value;
          const telefon = document.getElementById('telefon').value;
          const dataincepere = document.getElementById('dataincepere').value;
          const datafinal = document.getElementById('datafinal').value;
          const selectedCar = localStorage.getItem('selectedCar');
          await addDoc(collection(db, "clienti"), {
            nume: nume,
            prenume: prenume,
            telefon: telefon,
            dataincepere: dataincepere,
            datafinal: datafinal,
            masina: selectedCar
          });
          alert("Inchirierea s-a realizat cu succes!");
        });
      }
    });
    
    async function blockReservedDates() {
      const selectedCar = localStorage.getItem('selectedCar');
      if (!selectedCar) return;
    
      const q = query(collection(db, "clienti"));
      const querySnapshot = await getDocs(q);
    
      let reservedDates = [];
    
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.masina === selectedCar) {
          let currentStartDate = new Date(data.dataincepere);
          let currentEndDate = new Date(data.datafinal);
    
          while (currentStartDate <= currentEndDate) {
            reservedDates.push(new Date(currentStartDate).toISOString().split('T')[0]);
            currentStartDate.setDate(currentStartDate.getDate() + 1);
          }
        }
      });
    
      const flatpickrConfig = {
        minDate: new Date().toISOString().split('T')[0],
        disable: reservedDates,
        onDayCreate: function(dObj, dStr, fp, dayElem) {
          const date = dayElem.dateObj.toISOString().split('T')[0];
          if (reservedDates.includes(date)) {
            dayElem.classList.add('reserved-date');
          }
        },
      };
    
      flatpickr("#dataincepere", flatpickrConfig);
      flatpickr("#datafinal", flatpickrConfig);
    }