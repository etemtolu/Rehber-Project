class Kisi{
    constructor (ad,soyad,mail){
        this.ad = ad;
        this.soyad = soyad;
        this.mail = mail;
    }
}
class Util{

    static bosAlanKontrolEt(...alanlar){
        let sonuc = true;
        alanlar.forEach(alan => {
            if (alan.length == 0){
                sonuc = false;
                return false;
            }
        });
        return sonuc;
    }
    static emailGecerliMi (email){
        const re = /^(([^<>()[]\\.,;:\s@\"]+(\.[^<>()[]\\.,;:\s@\"]+)*)|(\".+\"))@(([[0-9]{1,3}\‌​.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
        return re.test(email);
    }

}

class Ekran{
    constructor (){
        this.ad = document.getElementById('ad');
        this.soyad = document.getElementById('soyad');
        this.mail = document.getElementById('mail');
        this.ekleGuncelleButon = document.querySelector('.kaydetGuncelle');
        this.form = document.getElementById('form-rehber').addEventListener('submit',this.kaydetGuncelle.bind(this));
        this.kisiListesi = document.querySelector('.kisi-listesi');
        this.kisiListesi.addEventListener('click',this.guncelleVeyaSil.bind(this));
        this.depo = new Depo();
        this.secilenSatir = undefined;
        this.kisileriEkranaYazdir();
        this.form = document.getElementById('form-rehber');
        this.form.addEventListener('submit',this.kaydetGuncelle.bind(this))
    }
    alanlariTemizle(){
        this.ad.value = '';
        this.soyad.value = '';
        this.mail.value = '';
    }
    guncelleVeyaSil(e){
        const tiklanmaYeri= e.target;
        if(tiklanmaYeri.classList.contains('btn--delete')){
            this.secilenSatir = tiklanmaYeri.parentElement.parentElement;
            this.kisiyiEkrandanSil();
        }else if(tiklanmaYeri.classList.contains('btn--edit')){
            this.secilenSatir = tiklanmaYeri.parentElement.parentElement;
            this.ekleGuncelleButon.value='Güncelle';
            this.ad.value = this.secilenSatir.cells[0].textContent;
            this.soyad.value = this.secilenSatir.cells[1].textContent;
            this.mail.value = this.secilenSatir.cells[2].textContent;
            
        }
    }
    bilgiOlustur(mesaj,durum){
        const uyariDivi = document.querySelector('.bilgi');
        uyariDivi.innerHTML = mesaj;
        uyariDivi.classList.add(durum ? 'bilgi--success' : 'bilgi--error');
        // setTimeout , setInterval
        setTimeout(function() {
           uyariDivi.className = 'bilgi';
        },2000);
    }
    kisiyiEkrandaGuncelle (kisi){
        this.depo.kisiGuncelle(kisi, this.secilenSatir.cells[2].textContent );
        this.secilenSatir.cells[0].textContent = kisi.ad;
        this.secilenSatir.cells[1].textContent = kisi.soyad;
        this.secilenSatir.cells[2].textContent = kisi.mail;
        this.alanlariTemizle();
        this.secilenSatir = undefined;
        this.ekleGuncelleButon.value = 'Kaydet';
        this.bilgiOlustur('Kişi Güncellendi',true);
    }
    kisiyiEkrandanSil(){
        this.secilenSatir.remove();
        const silinecekMail = this.secilenSatir.cells[2].textContent;
        this.depo.kisiSil(silinecekMail);
        this.alanlariTemizle();
        this.secilenSatir = undefined;
        this.bilgiOlustur('Kişi Rehberden Silindi',true);
    }

    kisileriEkranaYazdir(){
        this.depo.tumKisiler.forEach(kisi =>{
            this.kisiyiEkranaEkle(kisi);

        });

    }

    kisiyiEkranaEkle(kisi){
        const olusturulanTR = document.createElement('tr');
        olusturulanTR.innerHTML =`<td>${kisi.ad}</td>
        <td>${kisi.soyad}</td>
        <td>${kisi.mail}</td>
        <td>
            <button class="btn btn--edit">
                <i class="far fa-edit"></i>
            </button>
            <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>
        </td>`;
        this.kisiListesi.appendChild(olusturulanTR);
        
    }
    kaydetGuncelle(e){
        e.preventDefault();
        const kisi = new Kisi(this.ad.value,this.soyad.value,this.mail.value);
        const sonuc =  Util.bosAlanKontrolEt(kisi.ad,kisi.soyad,kisi.mail);
        const emailGecerliMi = Util.emailGecerliMi(this.mail.value);
        console.log(this.mail.value);
        if (sonuc){
            if(!emailGecerliMi){
                this.bilgiOlustur('Geçerli Bir Mail Yazınız.' , false);
                return;
            }
            if(this.secilenSatir){
                this.kisiyiEkrandaGuncelle(kisi);

            }else{
                this.bilgiOlustur('Başarılı',true);
                this.kisiyiEkranaEkle(kisi);
            this.depo.kisiEkle(kisi);
            }
            
            this.alanlariTemizle();
        }else {
            this.bilgiOlustur('Boş Alanları Doldurunuz.',false);
        }
    }
}
class Depo{

    constructor(){
        this.tumKisiler = this.kisileriGetir();
    }
    kisileriGetir(){
        let tumKisilerLocal;
        if(localStorage.getItem('tumKisiler') === null){
            tumKisilerLocal = [];
        }else{
            tumKisilerLocal = JSON.parse(localStorage.getItem('tumKisiler'));
        }
        return tumKisilerLocal;
    }
    kisiEkle(kisi){
        this.tumKisiler.push(kisi);
        localStorage.setItem('tumKisiler',JSON.stringify(this.tumKisiler));
    }
    kisiSil(mail){
        this.tumKisiler.forEach((kisi,index) => {
            if(kisi.mail=== mail){
                this.tumKisiler.splice(index,1);
            }
        });
        localStorage.setItem('tumKisiler',JSON.stringify(this.tumKisiler));
    }
    kisiGuncelle(guncellenmisKisi,mail){
        this.tumKisiler.forEach((kisi,index) => {
            if(kisi.mail=== mail){
                this.tumKisiler[index]=guncellenmisKisi;
            }
        });
        localStorage.setItem('tumKisiler',JSON.stringify(this.tumKisiler));
    }
}

document.addEventListener('DOMContentLoaded', function (e) {
    const ekran = new Ekran();
});