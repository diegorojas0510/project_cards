// --- API del Clima (Open-Meteo) ---
export async function loadWeather() {
    try {
        if (navigator.geolocation) {
            // Usamos una Promesa para manejar la llamada asíncrona a la geolocalización.
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const data = await response.json();
            return data.current_weather; // Devolvemos solo la parte que nos interesa.
        }
        return null; // Si no hay geolocalización, devolvemos null.
    } catch (error) {
        console.error('Error loading weather:', error);
        return null; // En caso de error, devolvemos null para no romper la app.
    }
}

export async function loadInspirationalQuote() {
    try {
        // --- CAMBIO ---
        // Hemos cambiado la URL a una API que funciona correctamente.
        const response = await fetch('https://dummyjson.com/quotes/random');
        const data = await response.json();

        // Adaptamos la respuesta, ya que esta API devuelve "quote" en lugar de "content".
        // El resto de tu aplicación seguirá funcionando igual porque espera un objeto con { text, author }.
        return {
            text: data.quote,
            author: data.author
        };
    } catch (error) {
        console.error('Error loading quote, using fallback:', error);
        // Tu genial código de respaldo seguirá funcionando si esta nueva API también falla.
        const fallbackQuotes = [
            { text: "La creatividad es la inteligencia divirtiéndose.", author: "Albert Einstein" },
            { text: "El éxito es ir de fracaso en fracaso sin perder el entusiasmo.", author: "Winston Churchill" },
            { text: "La innovación distingue entre un líder y un seguidor.", author: "Steve Jobs" }
        ];
        return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    }
}