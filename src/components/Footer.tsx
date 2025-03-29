import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-apple-gray-100 py-12 px-6 mt-16 border-t border-apple-gray-200">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-apple-headline text-apple-black mb-4 font-semibold">
            About NIBOG
          </h4>
          <p className="text-apple-body text-apple-gray-600">
            New India Baby Olympics Games (NIBOG) is dedicated to creating engaging, developmental events for babies and young children across India.
          </p>
        </div>
        
        <div>
          <h4 className="text-apple-headline text-apple-black mb-4 font-semibold">
            Quick Links
          </h4>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/events" 
                className="text-apple-body text-apple-gray-700 
                           hover:text-apple-blue-500 
                           transition-apple-all"
              >
                Upcoming Events
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className="text-apple-body text-apple-gray-700 
                           hover:text-apple-blue-500 
                           transition-apple-all"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="text-apple-body text-apple-gray-700 
                           hover:text-apple-blue-500 
                           transition-apple-all"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-apple-headline text-apple-black mb-4 font-semibold">
            Contact Us
          </h4>
          <p className="text-apple-body text-apple-gray-600">
            Email: support@nibog.in
            <br />
            Phone: +91 9876543210
          </p>
          <div className="mt-4 flex space-x-4">
            {/* Social Media Icons */}
            <a 
              href="#" 
              className="text-apple-gray-600 hover:text-apple-blue-500 
                         transition-apple-all"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
              </svg>
            </a>
            <a 
              href="#" 
              className="text-apple-gray-600 hover:text-apple-blue-500 
                         transition-apple-all"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.367 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-12 pt-6 border-t border-apple-gray-200">
        <p className="text-apple-footnote text-apple-gray-500">
          {new Date().getFullYear()} NIBOG. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
