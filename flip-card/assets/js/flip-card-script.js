/**
 * Elementor Flip Card Carousel Script
 *
 * This script manages the flipping and reordering of cards in the carousel.
 *
 * @package ElementorFlipCardCarousel
 */

// Use a self-executing function to avoid global namespace pollution.
(function () {
    'use strict';

    // Wait for the DOM to be fully loaded before running the script.
    document.addEventListener('DOMContentLoaded', function () {
        // Select all instances of the carousel on the page.
        const carousels = document.querySelectorAll('.flip-card-carousel-container');

        // Loop through each carousel and initialize the functionality.
        carousels.forEach(carousel => {
            initFlipCardCarousel(carousel);
        });
    });

    /**
     * Initializes the flip card carousel functionality for a given container.
     * @param {HTMLElement} carousel - The carousel container element.
     */
    function initFlipCardCarousel(carousel) {
        // Get the list of cards within the current carousel.
        const cards = carousel.querySelectorAll('.flip-card');

        // If no cards are found, exit the function.
        if (cards.length === 0) {
            return;
        }

        // Use a promise to handle the end of the CSS transition reliably.
        const transitionEndPromise = (element) => {
            return new Promise(resolve => {
                // Fallback timeout in case transitionend doesn't fire (e.g. tab inactive)
                const timeout = setTimeout(() => {
                    element.removeEventListener('transitionend', onTransitionEnd);
                    resolve();
                }, 700); // Slightly longer than CSS duration (0.6s)

                const onTransitionEnd = (e) => {
                    // Ensure we are listening to the transform transition of the card itself
                    if (e.target === element && e.propertyName === 'transform') {
                        clearTimeout(timeout);
                        element.removeEventListener('transitionend', onTransitionEnd);
                        resolve();
                    }
                };
                element.addEventListener('transitionend', onTransitionEnd);
            });
        };

        /**
         * Flips the current front card and moves it to the back of the stack (Next).
         */
        const flipCard = async (e) => {
            // If the click came from inside a card link, don't flip
            if (e && e.target.closest('a')) return;

            // Get the card that is currently at the front of the stack.
            const currentCard = carousel.firstElementChild;
            // Ensure we are selecting a card and not the nav buttons
            if (!currentCard.classList.contains('flip-card')) return;

            if (currentCard.classList.contains('flipping')) return;

            // Add the 'flipping' class to trigger the CSS animation (Move Up).
            currentCard.classList.add('flipping');

            // Wait for the CSS transition to complete (Up motion).
            await transitionEndPromise(currentCard);

            // Move to end
            // Note: We need to insert it BEFORE the navigation container if it exists
            const nav = carousel.querySelector('.flip-card-nav');
            if (nav) {
                carousel.insertBefore(currentCard, nav);
            } else {
                carousel.appendChild(currentCard);
            }

            // Force reflow
            void currentCard.offsetWidth;

            currentCard.classList.remove('flipping');
        };

        /**
         * Moves the last card to the front (Previous).
         */
        const prevCard = async (e) => {
            if (e) e.stopPropagation(); // Prevent bubbling

            // Find the last card. 
            // The container processes children in order. The cards are 1..N.
            // The nav container is likely the last child now.
            // We need to find the last element that is actually a .flip-card
            const allCards = carousel.querySelectorAll('.flip-card');
            if (allCards.length === 0) return;

            const lastCard = allCards[allCards.length - 1];

            // If it's currently animating, wait/ignore?
            if (lastCard.classList.contains('flipping')) return;

            // To animate "in", we could rely on the natural CSS opacity transition
            // when it becomes nth-child(1).
            // But if we just move it, it might snap.
            // The cards have `transition: transform ... opacity ...`

            // Move it to the front
            carousel.prepend(lastCard);

            // It will naturally transition from its "bottom stack" style to "top stack" style.
            // Because it was last (opacity 0, rotated), and now is first (opacity 1, straight).
        };

        // Event Listeners

        // Next Button
        const nextBtn = carousel.querySelector('.flip-nav-next');
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                flipCard();
            });
        }

        // Prev Button
        const prevBtn = carousel.querySelector('.flip-nav-prev');
        if (prevBtn) {
            prevBtn.addEventListener('click', prevCard);
        }

        // Card Clicks (only if not clicking buttons)
        const cardsArray = carousel.querySelectorAll('.flip-card');
        cardsArray.forEach(card => {
            card.addEventListener('click', flipCard);
        });
    }

})();