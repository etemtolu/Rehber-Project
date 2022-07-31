//Arayüz Elementeri Seçimi.

const ad = document.getElementById('ad');
const soyad = document.getElementById('soyad');
const mail = document.getElementById('mail');

const form = document.getElementById('form-rehber');
const kisiListesi = document.querySelector('.kisi-listesi');
// Tüm Kişiler İçin Dizi.
const tumKisilerDizisi = [];
let secilenSatir = undefined;
// Event Listener Tanımlanması.
form.addEventListener('submit', kaydet);
kisiListesi.addEventListener('click', kisiIslemleriniYap);

function kisiIslemleriniYap(e){
    if (e.target.classList.contains('btn--delete')){
        const silinecekTr = e.target.parentElement.parentElement;
        const silinecekMail = e.target.parentElement.previousElementSibling.textContent;
        rehberdenSil(silinecekTr,silinecekMail);
    }else if (e.target.classList.contains('btn--edit')){
        document.querySelector('.kaydetGuncelle').value='Güncelle';
        const secilenTr = e.target.parentElement.parentElement;
        const guncellenecekMail = secilenTr.cells[2].textContent;

        ad.value = secilenTr.cells[0].textContent;
        soyad.value = secilenTr.cells[1].textContent;
        mail.value = secilenTr.cells[2].textContent;

        secilenSatir = secilenTr;

    }
}

function rehberdenSil(silinecekTrElement,silinecekMail){
    silinecekTrElement.remove();

    //maile Göre Silme
    tumKisilerDizisi.forEach((kisi,index) =>{
        if(kisi.mail===silinecekMail){
            tumKisilerDizisi.splice(index , 1);
        }
    });
    alanlariTemizle();
    document.querySelector('.kaydetGuncelle').value = 'Kaydet';

}
function kaydet(e){
    e.preventDefault();
    const eklenecekveyaGuncellenecekkisi = {
        ad : ad.value,
        soyad : soyad.value,
        mail : mail.value,
    }
    const sonuc = verileriKontrolEt(eklenecekveyaGuncellenecekkisi);
    if(sonuc.durum){
        if(secilenSatir){
                kisiyiGuncelle(eklenecekveyaGuncellenecekkisi);
        }else{
            kisiyiEkle(eklenecekveyaGuncellenecekkisi);
        }
      //  kisiyiEkle(eklenecekveyaGuncellenecekkisi);
        
    }else {
        bilgiOlustur(sonuc.mesaj , sonuc.durum);
}
}

function kisiyiGuncelle(kisi){
    for(let i= 0;i<tumKisilerDizisi.length;i++){
        if(tumKisilerDizisi[i].mail === secilenSatir.cells[2]){
            tumKisilerDizisi[i] = kisi;
            break;
        }
    }

    secilenSatir.cells[0].textContent=kisi.ad;
    secilenSatir.cells[1].textContent=kisi.soyad;
    secilenSatir.cells[2].textContent=kisi.mail;
    document.querySelector('.kaydetGuncelle').value='Kaydet';
    secilenSatir = undefined;
}




function verileriKontrolEt(kisi) {
    //Objelerde İn Kullanımı.
    for (const deger in kisi){
        if(kisi[deger]){
            console.log(kisi[deger]);
        }else{
            const sonuc = {
                durum:false,
                mesaj : 'Boş Alan Bırakmayınız.'
            }
            return sonuc;
        }
        alanlariTemizle();
        return {
            durum : true,
            mesaj : 'Kaydedildi.',
        };

    }
}
function bilgiOlustur(mesaj,durum){
    const olusturulanBilgi = document.createElement('div');
    olusturulanBilgi.textContent = mesaj;
    olusturulanBilgi.className='bilgi';
    if (durum){
        olusturulanBilgi.classList.add('bilgi--success');
    }else{
        olusturulanBilgi.classList.add('bilgi--error');
    }
    document.querySelector('.container').insertBefore(olusturulanBilgi,form);
    // setTimeout , setInterval
    setTimeout(function() {
        const silinecekDiv = document.querySelector('.bilgi');
        if (silinecekDiv) {
            silinecekDiv.remove();
        }
    },2000);
}
function alanlariTemizle(){
    ad.value = '';
    soyad.value ='';
    mail.value = '';
}
function kisiyiEkle(eklenecekkisi) {

const olusturulanTrElementi = document.createElement('tr');
    olusturulanTrElementi.innerHTML =`<td>${eklenecekkisi.ad}</td>
    <td>${eklenecekkisi.soyad}</td>
    <td>${eklenecekkisi.mail}</td>
    <td>
        <button class="btn btn--edit">
            <i class="far fa-edit"></i>
        </button>
        <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>
    </td>`

    kisiListesi.appendChild(olusturulanTrElementi);
    tumKisilerDizisi.push(eklenecekkisi);

    bilgiOlustur('Kişi Rehbere Kaydedildi.',true);

}