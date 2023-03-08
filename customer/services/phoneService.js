export class Service {
    getPhones = async () => {
      try {
        const res = await axios({
          url: 'https://63f70b96e40e087c95866863.mockapi.io/api/N10/products',
          method: 'GET',
        });
        return res.data;
      } catch (err) {
        console.log(err);
      }
    };
    getPhoneById = async (id) => {
      try {
        const res = await axios({
          url: `https://63f70b96e40e087c95866863.mockapi.io/api/N10/products/${id}`,
          method: 'GET',
        });
  
        return res.data;
      } catch (err) {
        console.log(err);
      }
    };
  }
  