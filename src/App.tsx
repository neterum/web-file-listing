import React from 'react';
import './App.css';
import FileListing from './components/fileListing'; // Update import statement

function App() {
  const showTheModal = () => {
    const modal = document.getElementById('my_modal_1');
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button className="btn" onClick={() => showTheModal()}>open modal</button>
      <FileListing />
    </>
  );
}

export default App;
