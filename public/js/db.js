// offline data
db.enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // probably multible tabs open at once
      console.log('persistance failed');
    } else if (err.code == 'unimplemented') {
      // lack of browser support for the feature
      console.log('persistance not available');
    }
  });
 

// real-time listener
db.collection('informations').onSnapshot((snapshot) => {
    // console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        // console.log(change, change.doc.data(), change.doc.id);
        if(change.type === 'added'){
            //add document data to the web
            renderInformation(change.doc.data(), change.doc.id);
        }
        if(change.type === 'removed'){
            // remove document data from the web
            removeInformation(change.doc.id);
        }
    });
});

// add new informations
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
    evt.preventDefault();

    const information = {
        title: form.title.value,
        specs: form.specs.value
    };

    db.collection('informations').add(information)
    .catch(err => console.log(err));

    form.title.value = '';
    form.specs.value = '';
});

// delete informations
const informationContainer = document.querySelector('.informations');
informationContainer.addEventListener('click', evt => {
    // console.log(evt);
    if(evt.target.tagName === 'I'){
        const id = evt.target.getAttribute('data-id');
        db.collection('informations').doc(id).delete();
    }
});