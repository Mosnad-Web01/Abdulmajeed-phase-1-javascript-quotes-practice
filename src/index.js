document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.getElementById('quote-list');

    fetch('http://localhost:3000/quotes?_embed=likes')
        .then(response => response.json())
        .then(quotes => {
            quotes.forEach(quote => {
                createQuoteCard(quote);
            });
        });

    function createQuoteCard(quote) {
        const quoteCard = document.createElement('li');
        quoteCard.className = 'quote-card';

        const blockquote = document.createElement('blockquote');
        blockquote.className = 'blockquote';

        const quoteText = document.createElement('p');
        quoteText.className = 'mb-0';
        quoteText.textContent = quote.quote;

        const footer = document.createElement('footer');
        footer.className = 'blockquote-footer';
        footer.textContent = quote.author;

        const likeButton = document.createElement('button');
        likeButton.className = 'btn btn-success';

        const likesCount = quote.likes ? quote.likes.length : 0;
        likeButton.innerHTML = `Likes: <span>${likesCount}</span>`;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.textContent = 'Delete';

        blockquote.appendChild(quoteText);
        blockquote.appendChild(footer);
        blockquote.appendChild(document.createElement('br'));
        blockquote.appendChild(likeButton);
        blockquote.appendChild(deleteButton);

        quoteCard.appendChild(blockquote);
        quoteList.appendChild(quoteCard);

        likeButton.addEventListener('click', () => {
            fetch('http://localhost:3000/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quoteId: quote.id })
            })
            .then(response => response.json())
            .then(() => {
                const newLikesCount = parseInt(likeButton.querySelector('span').textContent) + 1;
                likeButton.querySelector('span').textContent = newLikesCount;
            });
        });

        deleteButton.addEventListener('click', () => {
            fetch(`http://localhost:3000/quotes/${quote.id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    quoteList.removeChild(quoteCard);
                }
            });
        });
    }

    const newQuoteForm = document.getElementById('new-quote-form');
    newQuoteForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newQuote = {
            quote: event.target.quote.value,
            author: event.target.author.value,
            likes: []
        };

        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newQuote)
        })
        .then(response => response.json())
        .then(createdQuote => {
            createQuoteCard(createdQuote);
            newQuoteForm.reset();
        });
    });
});
