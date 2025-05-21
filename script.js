// استبدل هذه البيانات ببيانات firebaseConfig الخاصة بك
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();

function uploadProduct() {
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const number = document.getElementById('whatsappNumber').value;
    const imageFile = document.getElementById('productImage').files[0];

    if (!name || !price || !number || !imageFile) {
        alert("يرجى تعبئة جميع الحقول");
        return;
    }

    const storageRef = storage.ref('products/' + imageFile.name);
    storageRef.put(imageFile).then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
            const productRef = db.ref('products').push();
            productRef.set({
                name: name,
                price: price,
                whatsapp: number,
                imageUrl: url
            }).then(() => {
                alert("تمت إضافة المنتج بنجاح");
                loadProducts();
            });
        });
    });
}

function loadProducts() {
    const list = document.getElementById('productsList');
    list.innerHTML = "";
    db.ref('products').once('value', snapshot => {
        snapshot.forEach(child => {
            const data = child.val();
            const div = document.createElement('div');
            div.className = "product";
            div.innerHTML = `
                <h3>${data.name}</h3>
                <p>السعر: ${data.price} ل.س</p>
                <a href="https://wa.me/${data.whatsapp}" target="_blank">تواصل واتساب</a><br>
                <img src="${data.imageUrl}" alt="صورة المنتج">
            `;
            list.appendChild(div);
        });
    });
}

window.onload = loadProducts;