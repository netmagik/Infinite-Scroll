// IIFE
(() => {
    
    const quotesEl = document.querySelector('.quotes');
    const loader = document.querySelector('.loader');

    // Get Quotes
    const getQuotes = async (page, limit) => {
        const API_URL = `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`;
        const response = await fetch(API_URL);

        // error
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.status}`);
        }

        return await response.json();
    }

    // Show Quotes
    const showQuotes = (quotes) => {
        quotes.forEach(quote => {
            const quoteEl = document.createElement('blockquote');
            quoteEl.classList.add('quote');

            quoteEl.innerHTML = 
            `<span>${quote.id}.  </span>
            ${quote.quote}
            <footer>${quote.author}</footer>`;

            quotesEl.appendChild(quoteEl)

        });
    }

    // Loading indicator
    const hideLoader = () => {
        loader.classList.remove('show');
    }

    const showLoader = () => {
        loader.classList.add('show');
    }

    let currentPage = 1;

    // Number of quotes to fetch at a time
    const limit = 10;

    // Total number of quotes returned from the API
    let total = 0;

    const hasMoreQuotes = (page, limit, total) => {
        const startIndex = (page - 1) * limit + 1;
        return total === 0 || startIndex < total;
    }

    // Load Quotes
    const loadQuotes = async (page, limit) => {
        // show the loader
        showLoader();
        setTimeout(async () => {
            try {
                if (hasMoreQuotes(page, limit, total)) {
                    const response = await getQuotes(page, limit);
                    showQuotes(response.data);
                    total = response.total;
                }
            } catch (error) {
                console.log(error.message)
            } finally {
                hideLoader();
            }
        }, 500);
    }

    window.addEventListener('scroll', () => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 5 &&
            hasMoreQuotes(currentPage, limit, total)) {
                currentPage++;
                loadQuotes(currentPage, limit);
            }
        }, {
            passive: true
    });

    // initialize
    loadQuotes(currentPage, limit);
})();