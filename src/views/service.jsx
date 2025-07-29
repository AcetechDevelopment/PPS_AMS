
const base_url = 'http://localhost/API/public/api/';
const file_base_url = "http://localhost/API/public/";
const isNumberKey = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    const charStr = String.fromCharCode(charCode);
  
    // Allow numbers (0-9), decimal (.), and fraction (/)
    if (!/[\d./]/.test(charStr)) {
      event.preventDefault();
    }
  };

  const today = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  export { base_url, isNumberKey, today, file_base_url };
  