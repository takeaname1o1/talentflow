import './App.css'
import TestFetch from './components/TestFetch'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>TalentFlow - Development Mode</h1>
        <p>Mock API with Local Persistence (IndexedDB)</p>
      </header>
      <main>
        <TestFetch />
      </main>
    </div>
  )
}

export default App