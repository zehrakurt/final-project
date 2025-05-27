import './input.css'

export default function Input() {
    return (
      <div className="input-container flex flex-col items-center gap-4">
        <label htmlFor="name" className="label-align text-sm font-medium leading-6 text-gray-900 text-center mb-2">
          Bize aşağıdaki iletişim ulaşabilirsiniz.
        </label>
        <div className="name-surname-container flex flex-col sm:flex-row gap-4 justify-center">
          <input 
            id="name"
            name="name"
            type="text"
            placeholder="İsim *"
            className="label-4 block w-full sm:w-1/2 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <input 
            id="price"
            name="surname"
            type="text"
            placeholder="Soyad"
            className="label-4 block w-full sm:w-1/2 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <input 
          id="email"
          name="e-posta"
          type="text"
          placeholder="E-Posta"
          className="mail-input block w-full sm:w-2/3 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-4"
        />
        <input 
          id="message"
          name="mesaj"
          type="text"
          placeholder="Mesaj"
          className="mesaj-input block w-full sm:w-2/3 rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-4"
        />
        <button className="gndr-btn mt-4">GÖNDER</button>
      </div>
    )
}
