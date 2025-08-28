import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer>
      <section className="section_home_roi">
        <div className="padding_global">
          <div className="main_container">
            <div className="home_roi_wrapper">
              <div className="home_roi_left">
                <div className="roi_image_wrapper">
                  <div className="rc_logo">
                    <div className="code-embed w-embed">
                      <svg width="100%" viewBox="0 0 28 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.5" d="M0.678761 31.4286H4.92114C5.29594 31.4286 5.6 31.7484 5.6 32.1427C5.6 32.5373 5.29594 32.8571 4.92114 32.8571H0.678761C0.303896 32.8571 0 32.5373 0 32.1427C0 31.7484 0.303896 31.4286 0.678761 31.4286Z" fill="currentColor"></path>
                        <path d="M2.77893 29.2857H7.02137C7.3963 29.2857 7.70001 29.6054 7.70001 29.9999C7.70001 30.3946 7.3963 30.7143 7.02137 30.7143H2.77893C2.40393 30.7143 2.10001 30.3946 2.10001 29.9999C2.10001 29.6054 2.40393 29.2857 2.77893 29.2857Z" fill="currentColor"></path>
                        <path d="M18.1969 11.7857C18.198 11.7768 18.1993 11.7686 18.2 11.7597H18.1939C18.0952 10.7569 17.416 10.0558 17.416 10.0558C17.416 10.0558 10.93 2.33962 9.84255 1.18281C8.75507 0.0256557 7.2621 -1.90735e-06 7.2621 -1.90735e-06H2.38348C-0.854852 0.236425 1.57518 3.42629 1.57518 3.42629C1.57518 3.42629 6.8467 9.2757 7.6635 10.4647C8.26117 11.3351 8.36459 11.6519 8.37756 11.7597H8.37483C8.37483 11.7597 8.3779 11.7652 8.37893 11.7792L8.37927 11.7857L8.37893 11.7922C8.3779 11.8062 8.37483 11.8117 8.37483 11.8117H8.37756C8.36459 11.9195 8.26117 12.2363 7.6635 13.1068C6.8467 14.2957 1.57518 20.1451 1.57518 20.1451C1.57518 20.1451 -0.854852 23.335 2.38348 23.5714H7.2621C7.2621 23.5714 8.75507 23.5458 9.84255 22.3886C10.93 21.2318 17.416 13.5156 17.416 13.5156C17.416 13.5156 18.0952 12.8146 18.1939 11.8117H18.2C18.1993 11.8028 18.198 11.7946 18.1969 11.7857Z" fill="currentColor"></path>
                        <path d="M21.3153 24.5353C20.7412 23.6646 20.6419 23.3477 20.6298 23.2399H20.6321C20.6321 23.2399 20.6292 23.2348 20.6282 23.2208L20.6279 23.2143L20.6282 23.2078C20.6292 23.1938 20.6321 23.1883 20.6321 23.1883H20.6298C20.6419 23.0805 20.7412 22.7637 21.3153 21.8932C22.0991 20.7043 27.1597 14.8549 27.1597 14.8549C27.1597 14.8549 29.4928 11.665 26.3838 11.4286H21.7003C21.7003 11.4286 20.2671 11.4542 19.2231 12.6114C18.1791 13.7682 11.9527 21.4844 11.9527 21.4844C11.9527 21.4844 11.3006 22.1851 11.2059 23.1883H11.2C11.2007 23.1972 11.2023 23.2054 11.2029 23.2143C11.2023 23.2228 11.2007 23.2314 11.2 23.2399H11.2059C11.3006 24.2431 11.9527 24.9439 11.9527 24.9439C11.9527 24.9439 18.1791 32.6604 19.2231 33.8172C20.2671 34.9743 21.7003 35 21.7003 35H26.3838C29.4928 34.7636 27.1597 31.5737 27.1597 31.5737C27.1597 31.5737 22.0991 25.7243 21.3153 24.5353Z" fill="currentColor"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <h2 className="h2_50px fff">Transform Your Revenue Cycle in 30 Days or Less</h2>
                <p className="para_16px is_white">Join leading healthcare organizations already seeing results with RapidClaims.</p>
              </div>
              <div className="home_roi_right">
                <a href="get-in-touch.html" className="mega_link_wrapper line_top_bottom w-inline-block">
                  <h3 className="h3_44px">Request ROI Analysis</h3>
                  <img src="images/arrow-right1_1arrow-right1.avif" loading="lazy" alt="" className="arrow_90px" />
                </a>
                <a href="get-in-touch.html" className="mega_link_wrapper line_top_bottom w-inline-block">
                  <h3 className="h3_44px">Calculate your savings</h3>
                  <img src="images/arrow-right1_1arrow-right1.avif" loading="lazy" alt="" className="arrow_90px" />
                </a>
                <a href="get-in-touch.html" className="mega_link_wrapper w-inline-block">
                  <h3 className="h3_44px">Schedule a demo</h3>
                  <img src="images/arrow-right1_1arrow-right1.avif" loading="lazy" alt="" className="arrow_90px" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="footer">
        <div className="padding_global">
          <div className="main_container">
            <div id="w-node-_081cbafd-5c80-6c34-4a36-220a4c16e521-4c16e51d" className="footer_logo">
              <a href="index.html" aria-current="page" className="footer_logo_wrappe w-inline-block w--current">
                <div className="rc_logo">
                  <div className="code-embed w-embed">
                    <svg width="100%" viewBox="0 0 28 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.5" d="M0.678761 31.4286H4.92114C5.29594 31.4286 5.6 31.7484 5.6 32.1427C5.6 32.5373 5.29594 32.8571 4.92114 32.8571H0.678761C0.303896 32.8571 0 32.5373 0 32.1427C0 31.7484 0.303896 31.4286 0.678761 31.4286Z" fill="currentColor"></path>
                      <path d="M2.77893 29.2857H7.02137C7.3963 29.2857 7.70001 29.6054 7.70001 29.9999C7.70001 30.3946 7.3963 30.7143 7.02137 30.7143H2.77893C2.40393 30.7143 2.10001 30.3946 2.10001 29.9999C2.10001 29.6054 2.40393 29.2857 2.77893 29.2857Z" fill="currentColor"></path>
                      <path d="M18.1969 11.7857C18.198 11.7768 18.1993 11.7686 18.2 11.7597H18.1939C18.0952 10.7569 17.416 10.0558 17.416 10.0558C17.416 10.0558 10.93 2.33962 9.84255 1.18281C8.75507 0.0256557 7.2621 -1.90735e-06 7.2621 -1.90735e-06H2.38348C-0.854852 0.236425 1.57518 3.42629 1.57518 3.42629C1.57518 3.42629 6.8467 9.2757 7.6635 10.4647C8.26117 11.3351 8.36459 11.6519 8.37756 11.7597H8.37483C8.37483 11.7597 8.3779 11.7652 8.37893 11.7792L8.37927 11.7857L8.37893 11.7922C8.3779 11.8062 8.37483 11.8117 8.37483 11.8117H8.37756C8.36459 11.9195 8.26117 12.2363 7.6635 13.1068C6.8467 14.2957 1.57518 20.1451 1.57518 20.1451C1.57518 20.1451 -0.854852 23.335 2.38348 23.5714H7.2621C7.2621 23.5714 8.75507 23.5458 9.84255 22.3886C10.93 21.2318 17.416 13.5156 17.416 13.5156C17.416 13.5156 18.0952 12.8146 18.1939 11.8117H18.2C18.1993 11.8028 18.198 11.7946 18.1969 11.7857Z" fill="currentColor"></path>
                      <path d="M21.3153 24.5353C20.7412 23.6646 20.6419 23.3477 20.6298 23.2399H20.6321C20.6321 23.2399 20.6292 23.2348 20.6282 23.2208L20.6279 23.2143L20.6282 23.2078C20.6292 23.1938 20.6321 23.1883 20.6321 23.1883H20.6298C20.6419 23.0805 20.7412 22.7637 21.3153 21.8932C22.0991 20.7043 27.1597 14.8549 27.1597 14.8549C27.1597 14.8549 29.4928 11.665 26.3838 11.4286H21.7003C21.7003 11.4286 20.2671 11.4542 19.2231 12.6114C18.1791 13.7682 11.9527 21.4844 11.9527 21.4844C11.9527 21.4844 11.3006 22.1851 11.2059 23.1883H11.2C11.2007 23.1972 11.2023 23.2054 11.2029 23.2143C11.2023 23.2228 11.2007 23.2314 11.2 23.2399H11.2059C11.3006 24.2431 11.9527 24.9439 11.9527 24.9439C11.9527 24.9439 18.1791 32.6604 19.2231 33.8172C20.2671 34.9743 21.7003 35 21.7003 35H26.3838C29.4928 34.7636 27.1597 31.5737 27.1597 31.5737C27.1597 31.5737 22.0991 25.7243 21.3153 24.5353Z" fill="currentColor"></path>
                    </svg>
                  </div>
                </div>
              </a>
              <div className="footer_awards">
                <div>Recognized by</div>
                <div className="footer_awards_image_wrapper">
                  <a href="black-book-2025.html" className="footer_awards_link w-inline-block">
                    <img src="images/Screenshot_2025-07-14_at_2.21.40_PM-removebg-preview.png" loading="lazy" alt="" className="footer-img" />
                  </a>
                  <a href="award.html" className="footer_awards_link w-inline-block">
                    <img src="images/FrostSullivan.png" loading="lazy" alt="" className="footer-img" />
                  </a>
                </div>
              </div>
            </div>
            <div className="footer_header">
              <div id="w-node-fadd8fb0-3705-eb0e-ad85-5b9d5c3c7008-4c16e51d" className="div-block-250">
                <div className="footer_link_wrapper">
                  <h3 className="h3_16px">PRODUCTS</h3>
                  <div className="footer_links">
                    <a href="products/rapid-code.html" className="footer_link w-inline-block">
                      <p>RapidCode</p>
                    </a>
                    <a href="products/rapid-scrub.html" className="footer_link w-inline-block">
                      <p>RapidScrub</p>
                    </a>
                    <a href="products/rapid-cdi.html" className="footer_link w-inline-block">
                      <p>RapidCDI</p>
                    </a>
                  </div>
                </div>
                <div className="footer_link_wrapper">
                  <h3 className="h3_16px">SOLUTIONS</h3>
                  <div className="footer_links">
                    <a href="solutions.html" className="footer_link w-inline-block">
                      <p>For types of customers</p>
                    </a>
                    <a href="solutions.html" className="footer_link w-inline-block">
                      <p>For types of roles</p>
                    </a>
                    <a href="solutions.html" className="footer_link w-inline-block">
                      <p>For types of use cases</p>
                    </a>
                  </div>
                </div>
                <div className="footer_link_wrapper">
                  <h3 className="h3_16px">Resources</h3>
                  <div className="footer_links">
                    <a href="resources/blogs.html" className="footer_link w-inline-block">
                      <p>Blogs</p>
                    </a>
                    <div className="footer_link none">
                      <p>Case Studies</p>
                    </div>
                    <div className="footer_link none">
                      <p>News</p>
                    </div>
                  </div>
                </div>
                <div className="footer_link_wrapper">
                  <div className="form-block w-form">
                    <form onSubmit={handleSubmit} className="form">
                      <label htmlFor="Email-2" className="field-label">Sign up for our newsletter</label>
                      <div className="form_field_wrapper">
                        <input 
                          className="text-field w-input" 
                          maxLength={256} 
                          name="Email-2" 
                          placeholder="Enter email address" 
                          type="email" 
                          id="Email-2"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <input type="submit" className="submit-button w-button" value="→" />
                      </div>
                    </form>
                    <div className="w-form-done">
                      <div>Thank you! Your submission has been received!</div>
                    </div>
                    <div className="w-form-fail">
                      <div>Oops! Something went wrong while submitting the form.</div>
                    </div>
                  </div>
                  <div id="w-node-_081cbafd-5c80-6c34-4a36-220a4c16e57e-4c16e51d" className="footer_address">
                    <p className="para_12px is_bold is_white">Address</p>
                    <p className="para_12px is_white">605W, 42nd Street, Manhattan, New York 10036</p>
                  </div>
                </div>
              </div>
              <div id="w-node-_081cbafd-5c80-6c34-4a36-220a4c16e589-4c16e51d" className="div-block-252">
                <div className="div-block-254">
                  <p>© 2025 RapidClaims. All rights reserved.</p>
                </div>
                <div id="w-node-cbe97f62-c58f-a34d-6f6b-456630b853d6-4c16e51d" className="div-block-251">
                  <a href="mailto:sales@rapidclaims.ai?subject=Inquiry" className="footer_link grey w-inline-block">
                    <p>Email sales@rapidclaims.ai</p>
                  </a>
                  <div className="div-block-253">
                    <a href="terms-of-service.html" className="footer_link grey w-inline-block">
                      <p>Terms of Service</p>
                    </a>
                    <a href="privacy-policy.html" className="footer_link grey w-inline-block">
                      <p>Privacy Policy</p>
                    </a>
                    <a href="cookie-policy.html" className="footer_link grey w-inline-block">
                      <p>Cookie Policy</p>
                    </a>
                  </div>
                  <a id="w-node-_081cbafd-5c80-6c34-4a36-220a4c16e584-4c16e51d" href="https://www.linkedin.com/company/rapidclaims-ai/posts/?feedView=all" className="social_links w-inline-block">
                    <div className="w-embed">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" fill="white"></rect>
                        <g clipPath="url(#clip0_205_1140)">
                          <path d="M8.15165 9.43292H5.26082C5.13252 9.43292 5.02856 9.53693 5.02856 9.66518V18.9522C5.02856 19.0805 5.13252 19.1844 5.26082 19.1844H8.15165C8.27995 19.1844 8.3839 19.0805 8.3839 18.9522V9.66518C8.3839 9.53693 8.27995 9.43292 8.15165 9.43292Z" fill="black"></path>
                          <path d="M6.70763 4.81573C5.65578 4.81573 4.80005 5.67054 4.80005 6.72123C4.80005 7.77238 5.65578 8.62751 6.70763 8.62751C7.75865 8.62751 8.61368 7.77233 8.61368 6.72123C8.61373 5.67054 7.75865 4.81573 6.70763 4.81573Z" fill="black"></path>
                          <path d="M15.5046 9.20148C14.3435 9.20148 13.4853 9.7006 12.9647 10.2677V9.66455C12.9647 9.5363 12.8607 9.4323 12.7324 9.4323H9.96395C9.83565 9.4323 9.73169 9.5363 9.73169 9.66455V18.9515C9.73169 19.0798 9.83565 19.1838 9.96395 19.1838H12.8485C12.9768 19.1838 13.0807 19.0798 13.0807 18.9515V14.3566C13.0807 12.8083 13.5013 12.205 14.5806 12.205C15.7561 12.205 15.8496 13.1721 15.8496 14.4363V18.9516C15.8496 19.0799 15.9535 19.1838 16.0818 19.1838H18.9674C19.0957 19.1838 19.1996 19.0799 19.1996 18.9516V13.8575C19.1996 11.5551 18.7606 9.20148 15.5046 9.20148Z" fill="black"></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_205_1140">
                            <rect width="14.4" height="14.4" fill="white" transform="translate(4.80005 4.79999)"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img src="images/65f2f511564b4dc62c234412_pattern-2_165f2f511564b4dc62c234412_pattern-2.avif" loading="lazy" alt="" className="footer_abso-2" />
        <img src="images/65f2f511564b4dc62c234412_pattern-1_165f2f511564b4dc62c234412_pattern-1.avif" loading="lazy" alt="" className="footer_abso-1" />
      </div>
    </footer>
  );
};
