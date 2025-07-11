'use client'

import { useState } from 'react'
import { convertCurrency } from '../lib/api'

const currencies = [
  { code: 'BRL', name: 'Real Brasileiro' },
  { code: 'USD', name: 'Dólar Americano' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Iene Japonês' },
  { code: 'BGN', name: 'Lev Búlgaro' },
  { code: 'CZK', name: 'Coroa Tcheca' },
  { code: 'DKK', name: 'Coroa Dinamarquesa' },
  { code: 'GBP', name: 'Libra Esterlina' },
  { code: 'HUF', name: 'Florim Húngaro' },
  { code: 'PLN', name: 'Zloti Polonês' },
  { code: 'RON', name: 'Leu Romeno' },
  { code: 'SEK', name: 'Coroa Sueca' },
  { code: 'CHF', name: 'Franco Suíço' },
  { code: 'ISK', name: 'Coroa Islandesa' },
  { code: 'NOK', name: 'Coroa Norueguesa' },
  { code: 'HRK', name: 'Kuna Croata' },
  { code: 'RUB', name: 'Rublo Russo' },
  { code: 'TRY', name: 'Lira Turca' },
  { code: 'AUD', name: 'Dólar Australiano' },
  { code: 'CAD', name: 'Dólar Canadense' },
  { code: 'CNY', name: 'Yuan Chinês' },
  { code: 'HKD', name: 'Dólar de Hong Kong' },
  { code: 'IDR', name: 'Rupia Indonésia' },
  { code: 'ILS', name: 'Shekel Novo Israelense' },
  { code: 'INR', name: 'Rúpia Indiana' },
  { code: 'KRW', name: 'Won Sul-Coreano' },
  { code: 'MXN', name: 'Peso Mexicano' },
  { code: 'MYR', name: 'Ringgit Malaio' },
  { code: 'NZD', name: 'Dólar Neozelandês' },
  { code: 'PHP', name: 'Peso Filipino' },
  { code: 'SGD', name: 'Dólar de Singapura' },
  { code: 'THB', name: 'Baht Tailandês' },
  { code: 'ZAR', name: 'Rand Sul-Africano' },
]

export default function ConverterForm() {
  const [inputAmount, setInputAmount] = useState<number>(0)
  const [fromCurrency, setFromCurrency] = useState('BRL')
  const [toCurrency, setToCurrency] = useState('USD')
  const [amount, setAmount] = useState<number>(0) // Armazena o valor usado na última conversão
  const [rate, setRate] = useState<number>(0)
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConvert() {
    if (inputAmount <= 0) {
      setError('Digite um valor válido')
      setResult(null)
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await convertCurrency(fromCurrency, toCurrency, inputAmount)
      setResult(data.result)
      setRate(data.rate)
      setAmount(inputAmount) // Só atualiza `amount` depois da conversão
    } catch (err) {
      setError('Falha ao obter conversão')
    } finally {
      setLoading(false)
    }
  }

  const getCurrencyName = (code: string) => {
    return currencies.find(c => c.code === code)?.name || code
  }

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <div className="flex gap-4">
        <input
          type="number"
          min="0"
          step="any"
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          placeholder="Valor"
          value={inputAmount}
          onChange={e => setInputAmount(parseFloat(e.target.value))}
        />

        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={fromCurrency}
          onChange={e => setFromCurrency(e.target.value)}
        >
          {currencies.map(c => (
            <option key={c.code} value={c.code}>
              {c.code} - {c.name}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={toCurrency}
          onChange={e => setToCurrency(e.target.value)}
        >
          {currencies.map(c => (
            <option key={c.code} value={c.code}>
              {c.code} - {c.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleConvert}
        disabled={loading}
        className="w-40 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Convertendo...' : 'Converter'}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 space-y-2">
          <p className="text-lg font-semibold">
            {amount.toFixed(2)} {getCurrencyName(fromCurrency)} =
          </p>
          <p className="text-xl font-bold">
            {result.toFixed(6)} {getCurrencyName(toCurrency)}
          </p>
          <p>
            1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}
          </p>
          <p>
            1 {toCurrency} = {(1 / rate).toFixed(6)} {fromCurrency}
          </p>
        </div>
      )}
    </div>
  )
}