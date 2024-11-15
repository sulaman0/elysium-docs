import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
export default function Header(){
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [appData, setAppData] = useState([]);


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://cdn.elysiumchain.tech/elysium-apps-icons/apps.json');
                setAppData(response.data?.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return(
        <>
          <div className="myDropDown">
              <div ref={dropdownRef} className={`dropdown ${isOpen ? 'show' : ''}`}>
                  <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      onClick={toggleDropdown}
                  >
                      <svg id="more" xmlns="http://www.w3.org/2000/svg" width="14.001" height="14.001" viewBox="0 0 14.001 14.001">
                          <circle id="Ellipse_964" data-name="Ellipse 964" cx="2.555" cy="2.555" r="2.555" transform="translate(0 0)" fill="#ada7b7"/>
                          <circle id="Ellipse_965" data-name="Ellipse 965" cx="2.555" cy="2.555" r="2.555" transform="translate(0 8.891)" fill="#ada7b7"/>
                          <circle id="Ellipse_966" data-name="Ellipse 966" cx="2.555" cy="2.555" r="2.555" transform="translate(8.891 0)" fill="#ada7b7"/>
                          <circle id="Ellipse_967" data-name="Ellipse 967" cx="2.555" cy="2.555" r="2.555" transform="translate(8.891 8.891)" fill="#ada7b7"/>
                      </svg>

                  </button>
                  <div className={`dropdown-menu dark-bg-dropdown ${isOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                      <ul>
                          {appData.map((app)=>{
                              return(
                                  <li key={app.title}>
                                      <a className="dropdown-item" href={app?.url}
                                         target="_blank">
                                          <>
                                              <img className={'icon'} src={app?.icon} alt="apps-icon"/>
                                              <span>{app?.title}</span>
                                          </>
                                      </a>
                                  </li>
                              )})}
                      </ul>

                  </div>
              </div>
          </div>
        </>
    )
}