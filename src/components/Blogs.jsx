import React from 'react';
import './Blogs.css';

const Blogs = () => {
  return (
    <section id="blogs" className="blogs-section">
      <div className="bg-graphic graphic-left-blogs"></div>
      <div className="container blogs-container animate-fade-in">
        <div className="blogs-header">
          <h2 className="section-title">Latest Insights</h2>
          <p className="section-subtitle">Stay updated with our latest healthcare news, medical research, and industry articles.</p>
        </div>
        <div className="blogs-grid">
          {[
            {
              id: 1,
              title: 'The Future of Digital Integration in Hospitals',
              tag: 'Technology',
              date: 'May 15, 2026',
              image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=600'
            },
            {
              id: 2,
              title: 'Rethinking Health Care Business Models',
              tag: 'Management',
              date: 'May 20, 2026',
              image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=600'
            },
            {
              id: 3,
              title: 'Hospital Operator Services Standards',
              tag: 'Operations',
              date: 'May 25, 2026',
              image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600'
            }
          ].map((blog) => (
            <div key={blog.id} className="blog-card glass-panel">
              <div className="blog-image">
                <img src={blog.image} alt={blog.title} className="blog-cover-img" />
                <span className="blog-tag">{blog.tag}</span>
              </div>
              <div className="blog-content">
                <span className="blog-date">{blog.date}</span>
                <h3>{blog.title}</h3>
                <p>Discover how modern technology is reshaping patient care, strategic market access, and operational workflows...</p>
                <a href="#" className="read-more">Read Article <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
