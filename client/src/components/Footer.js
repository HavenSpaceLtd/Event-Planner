import React from 'react';

function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" style={{ backgroundColor: '#3e2723', color: '#fff', height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <button className="btn btn-primary me-2" onClick={() => {}}>About the Project</button>
        <button className="btn btn-success me-2" onClick={() => {}}>Contact Admin</button>
        <button className="btn btn-danger" onClick={handleScrollToTop}>Back to Top</button>
      </div>
    </footer>
  );
}

export default Footer;
