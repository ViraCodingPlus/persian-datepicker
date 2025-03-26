/**
 * Persian Datepicker
 * A simple and clean Persian (Jalali) datepicker for Laravel
 * 
 * @author PDatepicker
 * @license MIT
 */

class PDatepicker {
    /**
     * Initialize the datepicker
     * 
     * @param {string|HTMLElement} selector The input element or selector
     * @param {object} options Datepicker options
     */
    constructor(selector, options = {}) {
        // Default options
        this.defaults = {
            format: 'YYYY/MM/DD',
            theme: 'default',
            rtl: true,
            language: 'fa',
            autoClose: true,
            timePicker: false,
            timeFormat: 'HH:mm:ss', // Format for time display
            viewMode: 'day',
            minDate: null,
            maxDate: null,
            initialValue: null,
            position: 'bottom',
            altField: null,
            altFormat: null,
            onSelect: null,
            onShow: null,
            onHide: null,
            customStyles: {}, // Custom CSS styles for datepicker elements
        };

        // Merge options
        this.options = { ...this.defaults, ...options };

        // Find the input element
        this.input = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (!this.input) {
            console.error('PDatepicker: Input element not found!');
            return;
        }

        // Create datepicker container
        this.createDatepickerContainer();

        // Initialize days, months and years names based on language
        this.initializeCalendarNames();

        // Initialize time picker if enabled
        if (this.options.timePicker) {
            this.initializeTimePicker();
        }

        // Attach event listeners
        this.attachEventListeners();

        // Set initial value if provided
        if (this.options.initialValue) {
            this.setDate(this.options.initialValue);
        }
    }

    /**
     * Apply custom styles to datepicker elements
     */
    applyCustomStyles() {
        const customStyles = this.options.customStyles;
        
        // Skip if no custom styles are defined
        if (!customStyles || Object.keys(customStyles).length === 0) {
            return;
        }
        
        // Apply styles to container
        if (customStyles.container) {
            this.applyStyles(this.container, customStyles.container);
        }
        
        // Apply styles to header and its elements
        if (customStyles.header) {
            this.applyStyles(this.header, customStyles.header);
        }
        
        if (customStyles.title) {
            this.applyStyles(this.title, customStyles.title);
        }
        
        if (customStyles.prevBtn) {
            this.applyStyles(this.prevBtn, customStyles.prevBtn);
        }
        
        if (customStyles.nextBtn) {
            this.applyStyles(this.nextBtn, customStyles.nextBtn);
        }
        
        // Apply styles to body
        if (customStyles.body) {
            this.applyStyles(this.body, customStyles.body);
        }
        
        // Apply styles to footer and today button
        if (customStyles.footer) {
            this.applyStyles(this.footer, customStyles.footer);
        }
        
        if (customStyles.todayBtn) {
            this.applyStyles(this.todayBtn, customStyles.todayBtn);
        }
        
        // Apply styles to time picker if enabled
        if (this.options.timePicker && this.timePicker) {
            if (customStyles.timePicker) {
                this.applyStyles(this.timePicker, customStyles.timePicker);
            }
            
            // Apply styles to specific time picker elements
            if (customStyles.timeValue) {
                const timeValues = this.timePicker.querySelectorAll('.pdatepicker-time-value');
                timeValues.forEach(element => this.applyStyles(element, customStyles.timeValue));
            }
            
            if (customStyles.timeButton) {
                const timeButtons = this.timePicker.querySelectorAll('.pdatepicker-time-up, .pdatepicker-time-down');
                timeButtons.forEach(element => this.applyStyles(element, customStyles.timeButton));
            }
        }
    }
    
    /**
     * Apply CSS styles to an element
     * 
     * @param {HTMLElement} element The element to style
     * @param {object} styles Object containing CSS styles
     */
    applyStyles(element, styles) {
        if (!element || !styles) return;
        
        Object.keys(styles).forEach(property => {
            element.style[property] = styles[property];
        });
    }

    /**
     * Create datepicker container and UI elements
     */
    createDatepickerContainer() {
        // Create main container
        this.container = document.createElement('div');
        this.container.className = `pdatepicker-container pdatepicker-theme-${this.options.theme}`;
        if (this.options.rtl) {
            this.container.classList.add('pdatepicker-rtl');
        }
        this.container.style.display = 'none';
        
        // Create header
        this.header = document.createElement('div');
        this.header.className = 'pdatepicker-header';
        
        // Create previous button
        this.prevBtn = document.createElement('button');
        this.prevBtn.className = 'pdatepicker-prev-btn';
        this.prevBtn.innerHTML = this.options.rtl ? '&rarr;' : '&larr;';
        this.header.appendChild(this.prevBtn);
        
        // Create title
        this.title = document.createElement('div');
        this.title.className = 'pdatepicker-title';
        this.header.appendChild(this.title);
        
        // Create next button
        this.nextBtn = document.createElement('button');
        this.nextBtn.className = 'pdatepicker-next-btn';
        this.nextBtn.innerHTML = this.options.rtl ? '&larr;' : '&rarr;';
        this.header.appendChild(this.nextBtn);
        
        // Create body
        this.body = document.createElement('div');
        this.body.className = 'pdatepicker-body';
        
        // Create time picker if enabled
        if (this.options.timePicker) {
            this.timePicker = document.createElement('div');
            this.timePicker.className = 'pdatepicker-time';
            this.timePicker.innerHTML = `
                <div class="pdatepicker-time-container">
                    <div class="pdatepicker-time-hours">
                        <button class="pdatepicker-time-up">+</button>
                        <span class="pdatepicker-time-value">12</span>
                        <button class="pdatepicker-time-down">-</button>
                    </div>
                    <div class="pdatepicker-time-separator">:</div>
                    <div class="pdatepicker-time-minutes">
                        <button class="pdatepicker-time-up">+</button>
                        <span class="pdatepicker-time-value">00</span>
                        <button class="pdatepicker-time-down">-</button>
                    </div>
                    <div class="pdatepicker-time-separator">:</div>
                    <div class="pdatepicker-time-seconds">
                        <button class="pdatepicker-time-up">+</button>
                        <span class="pdatepicker-time-value">00</span>
                        <button class="pdatepicker-time-down">-</button>
                    </div>
                </div>
            `;
        }
        
        // Create footer
        this.footer = document.createElement('div');
        this.footer.className = 'pdatepicker-footer';
        
        // Create today button
        this.todayBtn = document.createElement('button');
        this.todayBtn.className = 'pdatepicker-today-btn';
        this.todayBtn.textContent = this.options.language === 'fa' ? 'امروز' : 'Today';
        this.footer.appendChild(this.todayBtn);
        
        // Append all elements to container
        this.container.appendChild(this.header);
        this.container.appendChild(this.body);
        if (this.options.timePicker) {
            this.container.appendChild(this.timePicker);
        }
        this.container.appendChild(this.footer);
        
        // Append to document body
        document.body.appendChild(this.container);
        
        // Apply custom styles if defined
        this.applyCustomStyles();
        
        // Initialize calendar (default view)
        this.initializeCalendar();
    }

    /**
     * Initialize days, months and years names based on language
     */
    initializeCalendarNames() {
        if (this.options.language === 'fa') {
            this.dayNames = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
            this.monthNames = [
                'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
            ];
            
            // Create today's date with fallback values based on current date if getJalaliDate fails
            try {
                const now = new Date();
                this.today = this.getJalaliDate(now);
                // Ensure today has all required properties
                if (!this.today || typeof this.today.year === 'undefined') {
                    console.warn('PDatepicker: Failed to get Jalali date, using current date as fallback');
                    this.today = this.getJalaliDate(new Date());
                }
            } catch (error) {
                console.error('PDatepicker: Error in getJalaliDate', error);
                // Use current date as fallback
                const now = new Date();
                this.today = this.getJalaliDate(now);
            }
        } else {
            this.dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
            this.monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            this.today = {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                day: new Date().getDate()
            };
        }
        
        // Set current view date with a safety check
        this.currentViewDate = this.today ? { ...this.today } : this.getJalaliDate(new Date());
        
        // Ensure currentViewDate has a day property set
        if (!this.currentViewDate.day) {
            this.currentViewDate.day = 1;
        }
    }

    /**
     * Initialize calendar and render based on current view mode
     */
    initializeCalendar() {
        switch (this.options.viewMode) {
            case 'day':
                this.renderDaysView();
                break;
            case 'month':
                this.renderMonthsView();
                break;
            case 'year':
                this.renderYearsView();
                break;
            default:
                this.renderDaysView();
        }
    }

    /**
     * Render days view (calendar)
     */
    renderDaysView() {
        this.options.viewMode = 'day';
        
        // Safety check to prevent undefined errors
        if (!this.currentViewDate) {
            console.warn('PDatepicker: currentViewDate is undefined, initializing with current date');
            this.currentViewDate = this.options.language === 'fa' 
                ? this.getJalaliDate(new Date()) 
                : {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth() + 1,
                    day: new Date().getDate()
                };
        }
        
        // Safety check for dayNames
        if (!this.dayNames || !Array.isArray(this.dayNames) || this.dayNames.length !== 7) {
            console.warn('PDatepicker: dayNames is undefined or invalid, initializing with defaults');
            if (this.options.language === 'fa') {
                this.dayNames = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
            } else {
                this.dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
            }
        }
        
        // Safety check for monthNames
        if (!this.monthNames || !Array.isArray(this.monthNames) || this.monthNames.length === 0) {
            console.warn('PDatepicker: monthNames is undefined or empty, initializing with defaults');
            if (this.options.language === 'fa') {
                this.monthNames = [
                    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
                ];
            } else {
                this.monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
            }
        }
        
        // Safety check for month index bounds
        const month = this.currentViewDate.month;
        const year = this.currentViewDate.year;
        const monthIndex = month - 1;
        
        // Ensure month index is valid
        if (monthIndex < 0 || monthIndex >= this.monthNames.length) {
            console.warn(`PDatepicker: Invalid month index ${monthIndex}, using fallback`);
            this.currentViewDate.month = 1;
            const fallbackMonthName = this.options.language === 'fa' ? 'فروردین' : 'January';
            this.title.textContent = `${fallbackMonthName} ${year}`;
        } else {
            // Update title
            this.title.textContent = `${this.monthNames[monthIndex]} ${year}`;
        }
        
        this.title.dataset.year = year;
        this.title.dataset.month = month;
        
        // Get days to display
        let days = [];
        if (this.options.language === 'fa') {
            days = this.getJalaliMonthDays(year, month);
        } else {
            days = this.getGregorianMonthDays(year, month);
        }
        
        // Create calendar grid
        let html = '<div class="pdatepicker-days">';
        html += '<div class="pdatepicker-week-days">';
        
        // Create week days and add to DOM directly for better styling support
        this.body.innerHTML = '';
        const weekDaysContainer = document.createElement('div');
        weekDaysContainer.className = 'pdatepicker-week-days';
        
        for (let i = 0; i < 7; i++) {
            const dayName = i < this.dayNames.length ? this.dayNames[i] : `D${i}`;
            // Add special class for Friday (ج) in Persian calendar
            const isWeekend = (this.options.language === 'fa' && dayName === 'ج') || 
                            (this.options.language !== 'fa' && (dayName === 'Fr' || dayName === 'Sa'));
            
            const weekdayEl = document.createElement('div');
            weekdayEl.className = isWeekend ? 'pdatepicker-week-day pdatepicker-weekend-day' : 'pdatepicker-week-day';
            weekdayEl.textContent = dayName;
            
            // Apply custom styles to week day
            this.applyDynamicStyles('weekday', weekdayEl);
            
            weekDaysContainer.appendChild(weekdayEl);
        }
        
        const daysContainer = document.createElement('div');
        daysContainer.className = 'pdatepicker-days';
        daysContainer.appendChild(weekDaysContainer);
        
        // Create days grid
        const daysGrid = document.createElement('div');
        daysGrid.className = 'pdatepicker-days-grid';
        
        days.forEach((day, index) => {
            let classes = ['pdatepicker-day'];
            if (day.current) classes.push('pdatepicker-day-current');
            if (day.today) classes.push('pdatepicker-day-today');
            if (day.selected) classes.push('pdatepicker-day-selected');
            if (!day.current) {
                classes.push('pdatepicker-day-other-month');
                classes.push('pdatepicker-day-disabled'); // Add disabled class for non-current month days
            }
            
            // Add weekend class for Persian Friday (index % 7 = 6) or English Saturday/Sunday
            if (this.options.language === 'fa' && index % 7 === 6) {
                classes.push('pdatepicker-weekend-day');
            } else if (this.options.language !== 'fa' && (index % 7 === 0 || index % 7 === 6)) {
                classes.push('pdatepicker-weekend-day');
            }
            
            const dayEl = document.createElement('div');
            dayEl.className = classes.join(' ');
            dayEl.dataset.date = `${day.year}/${day.month}/${day.day}`;
            dayEl.textContent = day.day;
            
            // Apply custom styles to day
            this.applyDynamicStyles('day', dayEl);
            
            if (!dayEl.classList.contains('pdatepicker-day-disabled')) {
                dayEl.addEventListener('click', () => {
                    this.selectDate(dayEl.dataset.date);
                });
            } else {
                // Make non-current month days non-clickable
                dayEl.style.cursor = 'default';
            }
            
            daysGrid.appendChild(dayEl);
        });
        
        daysContainer.appendChild(daysGrid);
        this.body.appendChild(daysContainer);
    }

    /**
     * Render months view
     */
    renderMonthsView() {
        this.options.viewMode = 'month';
        
        // Safety check to prevent undefined errors
        if (!this.currentViewDate) {
            console.warn('PDatepicker: currentViewDate is undefined, initializing with current date');
            this.currentViewDate = this.options.language === 'fa' 
                ? this.getJalaliDate(new Date()) 
                : {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth() + 1,
                    day: new Date().getDate()
                };
        }
        
        // Safety check for monthNames
        if (!this.monthNames || !Array.isArray(this.monthNames) || this.monthNames.length === 0) {
            console.warn('PDatepicker: monthNames is undefined or empty, initializing with defaults');
            if (this.options.language === 'fa') {
                this.monthNames = [
                    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
                ];
            } else {
                this.monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
            }
        }
        
        const year = this.currentViewDate.year;
        
        // Update title
        this.title.textContent = year;
        this.title.dataset.year = year;
        
        // Clear body
        this.body.innerHTML = '';
        
        // Create months container
        const monthsContainer = document.createElement('div');
        monthsContainer.className = 'pdatepicker-months';
        
        for (let i = 0; i < 12; i++) {
            let classes = ['pdatepicker-month'];
            if (i + 1 === this.currentViewDate.month && year === this.currentViewDate.year) {
                classes.push('pdatepicker-month-selected');
            }
            
            // Safety check for month index bounds
            const monthName = i < this.monthNames.length ? this.monthNames[i] : `Month ${i+1}`;
            
            const monthEl = document.createElement('div');
            monthEl.className = classes.join(' ');
            monthEl.dataset.month = i + 1;
            monthEl.textContent = monthName;
            
            // Apply custom styles to month
            this.applyDynamicStyles('month', monthEl);
            
            monthEl.addEventListener('click', () => {
                // Update the currentViewDate month
                this.currentViewDate.month = parseInt(monthEl.dataset.month);
                
                // Update the date with the new month
                if (this.input.value) {
                    // Keep the same year and day, just change the month
                    const dateStr = `${this.currentViewDate.year}/${this.currentViewDate.month}/${this.currentViewDate.day}`;
                    this.selectDate(dateStr);
                } else {
                    // If no date is selected yet, set the first day of the selected month
                    // Make sure the day is set
                    if (!this.currentViewDate.day) {
                        this.currentViewDate.day = 1;
                    }
                    
                    const dateStr = `${this.currentViewDate.year}/${this.currentViewDate.month}/${this.currentViewDate.day}`;
                    this.selectDate(dateStr);
                }
                
                // Switch to days view
                this.renderDaysView();
            });
            
            monthsContainer.appendChild(monthEl);
        }
        
        this.body.appendChild(monthsContainer);
    }

    /**
     * Render years view
     */
    renderYearsView() {
        this.options.viewMode = 'year';
        
        // Safety check to prevent undefined errors
        if (!this.currentViewDate) {
            console.warn('PDatepicker: currentViewDate is undefined, initializing with current date');
            this.currentViewDate = this.options.language === 'fa' 
                ? this.getJalaliDate(new Date()) 
                : {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth() + 1,
                    day: new Date().getDate()
                };
        }
        
        const year = this.currentViewDate.year;
        const startYear = Math.floor(year / 12) * 12;
        const endYear = startYear + 11;
        
        // Update title
        this.title.textContent = `${startYear} - ${endYear}`;
        
        // Clear body
        this.body.innerHTML = '';
        
        // Create years container
        const yearsContainer = document.createElement('div');
        yearsContainer.className = 'pdatepicker-years';
        
        for (let i = startYear; i <= endYear; i++) {
            let classes = ['pdatepicker-year'];
            if (i === this.currentViewDate.year) {
                classes.push('pdatepicker-year-selected');
            }
            
            const yearEl = document.createElement('div');
            yearEl.className = classes.join(' ');
            yearEl.dataset.year = i;
            yearEl.textContent = i;
            
            // Apply custom styles to year
            this.applyDynamicStyles('year', yearEl);
            
            yearEl.addEventListener('click', () => {
                // Update the currentViewDate year
                this.currentViewDate.year = parseInt(yearEl.dataset.year);
                
                // Update the date with the new year
                if (this.input.value) {
                    // Keep the same month and day, just change the year
                    const dateStr = `${this.currentViewDate.year}/${this.currentViewDate.month}/${this.currentViewDate.day}`;
                    this.selectDate(dateStr);
                } else {
                    // If no date is selected yet, set the first day of the selected year/month
                    // Make sure the day is set
                    if (!this.currentViewDate.day) {
                        this.currentViewDate.day = 1;
                    }
                    
                    const dateStr = `${this.currentViewDate.year}/${this.currentViewDate.month}/${this.currentViewDate.day}`;
                    this.selectDate(dateStr);
                }
                
                // Switch to months view
                this.renderMonthsView();
            });
            
            yearsContainer.appendChild(yearEl);
        }
        
        this.body.appendChild(yearsContainer);
    }

    /**
     * Attach event listeners to UI elements
     */
    attachEventListeners() {
        // Input click event
        this.input.addEventListener('click', () => {
            this.show();
        });
        
        // Input focus event
        this.input.addEventListener('focus', () => {
            this.show();
        });
        
        // Document click event to hide datepicker when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target) && e.target !== this.input) {
                this.hide();
            }
        });
        
        // Previous button click
        this.prevBtn.addEventListener('click', () => {
            this.navigatePrev();
        });
        
        // Next button click
        this.nextBtn.addEventListener('click', () => {
            this.navigateNext();
        });
        
        // Title click for changing view
        this.title.addEventListener('click', () => {
            if (this.options.viewMode === 'day') {
                this.renderMonthsView();
            } else if (this.options.viewMode === 'month') {
                this.renderYearsView();
            }
        });
        
        // Today button click
        this.todayBtn.addEventListener('click', () => {
            // Ensure this.today is defined
            if (!this.today) {
                if (this.options.language === 'fa') {
                    try {
                        this.today = this.getJalaliDate(new Date());
                        if (!this.today || typeof this.today.year === 'undefined') {
                            // Get current date as fallback
                            this.today = this.getJalaliDate(new Date());
                        }
                    } catch (error) {
                        console.error('PDatepicker: Error getting Jalali date', error);
                        // Get current date as fallback
                        this.today = this.getJalaliDate(new Date());
                    }
                } else {
                    this.today = {
                        year: new Date().getFullYear(),
                        month: new Date().getMonth() + 1,
                        day: new Date().getDate()
                    };
                }
            }
            
            this.currentViewDate = { ...this.today };
            this.renderDaysView();
            this.selectDate(`${this.today.year}/${this.today.month}/${this.today.day}`);
            if (this.options.autoClose) {
                this.hide();
            }
        });
    }

    /**
     * Navigate to previous month/year/decade
     */
    navigatePrev() {
        if (this.options.viewMode === 'day') {
            if (this.currentViewDate.month === 1) {
                this.currentViewDate.year--;
                this.currentViewDate.month = 12;
            } else {
                this.currentViewDate.month--;
            }
            this.renderDaysView();
        } else if (this.options.viewMode === 'month') {
            this.currentViewDate.year--;
            this.renderMonthsView();
        } else if (this.options.viewMode === 'year') {
            this.currentViewDate.year -= 12;
            this.renderYearsView();
        }
    }

    /**
     * Navigate to next month/year/decade
     */
    navigateNext() {
        if (this.options.viewMode === 'day') {
            if (this.currentViewDate.month === 12) {
                this.currentViewDate.year++;
                this.currentViewDate.month = 1;
            } else {
                this.currentViewDate.month++;
            }
            this.renderDaysView();
        } else if (this.options.viewMode === 'month') {
            this.currentViewDate.year++;
            this.renderMonthsView();
        } else if (this.options.viewMode === 'year') {
            this.currentViewDate.year += 12;
            this.renderYearsView();
        }
    }

    /**
     * Show datepicker
     */
    show() {
        this.container.style.display = 'block';
        
        // Calculate position
        const inputRect = this.input.getBoundingClientRect();
        if (this.options.position === 'bottom') {
            this.container.style.top = `${inputRect.bottom + window.scrollY}px`;
            this.container.style.left = `${inputRect.left + window.scrollX}px`;
        } else if (this.options.position === 'top') {
            this.container.style.top = `${inputRect.top + window.scrollY - this.container.offsetHeight}px`;
            this.container.style.left = `${inputRect.left + window.scrollX}px`;
        }
        
        // Call onShow callback
        if (typeof this.options.onShow === 'function') {
            this.options.onShow();
        }
    }

    /**
     * Hide datepicker
     */
    hide() {
        this.container.style.display = 'none';
        
        // Call onHide callback
        if (typeof this.options.onHide === 'function') {
            this.options.onHide();
        }
    }

    /**
     * Format time according to specified format
     * 
     * @param {number} hours Hours
     * @param {number} minutes Minutes
     * @param {number} seconds Seconds
     * @param {string} format Format string
     * @returns {string} Formatted time
     */
    formatTime(hours, minutes, seconds, format) {
        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        
        // 12-hour format variables
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
        const hours12Str = hours12.toString().padStart(2, '0');
        
        let result = format
            // 24-hour format
            .replace(/HH/g, hoursStr)
            .replace(/H/g, hours.toString())
            // 12-hour format
            .replace(/hh/g, hours12Str)
            .replace(/h/g, hours12.toString())
            // Minutes and seconds
            .replace(/mm/g, minutesStr)
            .replace(/m/g, minutes.toString())
            .replace(/ss/g, secondsStr)
            .replace(/s/g, seconds.toString())
            // AM/PM indicators
            .replace(/A/g, period)
            .replace(/a/g, period.toLowerCase());
            
        return result;
    }
    
    /**
     * Select a date
     * 
     * @param {string} date Date in format YYYY/MM/DD
     */
    selectDate(date) {
        const parts = date.split('/');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);
        
        this.currentViewDate.year = year;
        this.currentViewDate.month = month;
        this.currentViewDate.day = day;
        
        // Initialize time values if not set
        if (this.options.timePicker && (!this.currentViewDate.hours || !this.currentViewDate.minutes || !this.currentViewDate.seconds)) {
            const now = new Date();
            this.currentViewDate.hours = now.getHours();
            this.currentViewDate.minutes = now.getMinutes();
            this.currentViewDate.seconds = now.getSeconds();
            this.updateTimePickerDisplay();
        }
        
        // Format date according to options
        let formattedDate = this.formatDate(date, this.options.format);
        
        // Add time if timePicker is enabled
        if (this.options.timePicker) {
            // Format time according to timeFormat option
            const timeStr = this.formatTime(
                this.currentViewDate.hours,
                this.currentViewDate.minutes,
                this.currentViewDate.seconds,
                this.options.timeFormat
            );
            
            // Add time to formatted date
            formattedDate += ` ${timeStr}`;
        }
        
        // Set input value
        this.input.value = formattedDate;
        
        // Set alt field value if specified
        if (this.options.altField) {
            const altField = document.querySelector(this.options.altField);
            if (altField) {
                const altFormat = this.options.altFormat || this.options.format;
                let altFormattedDate = this.formatDate(date, altFormat);
                
                // Add time if timePicker is enabled
                if (this.options.timePicker) {
                    // Format time according to timeFormat option
                    const timeStr = this.formatTime(
                        this.currentViewDate.hours,
                        this.currentViewDate.minutes,
                        this.currentViewDate.seconds,
                        this.options.timeFormat
                    );
                    
                    altFormattedDate += ` ${timeStr}`;
                }
                
                altField.value = altFormattedDate;
            }
        }
        
        // Highlight selected date
        const dayElements = this.container.querySelectorAll('.pdatepicker-day');
        dayElements.forEach(day => {
            day.classList.remove('pdatepicker-day-selected');
            if (day.dataset.date === date) {
                day.classList.add('pdatepicker-day-selected');
            }
        });
        
        // Call onSelect callback
        if (typeof this.options.onSelect === 'function') {
            this.options.onSelect(formattedDate, date);
        }
        
        // Auto close if enabled and time picker is not enabled
        if (this.options.autoClose && !this.options.timePicker) {
            this.hide();
        }
    }

    /**
     * Set date programmatically
     * 
     * @param {string} date Date to set
     */
    setDate(date) {
        this.selectDate(date);
    }

    /**
     * Format date according to specified format
     * 
     * @param {string} date Date in format YYYY/MM/DD
     * @param {string} format Format string
     * @returns {string} Formatted date
     */
    formatDate(date, format) {
        const parts = date.split('/');
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        
        let result = format
            .replace(/YYYY/g, year)
            .replace(/YY/g, year.slice(-2))
            .replace(/MM/g, month.toString().padStart(2, '0'))
            .replace(/M/g, month)
            .replace(/DD/g, day.toString().padStart(2, '0'))
            .replace(/D/g, day);
            
        return result;
    }

    /**
     * Get Jalali date from Gregorian date
     * 
     * @param {Date} date Gregorian date
     * @returns {object} Jalali date object {year, month, day}
     */
    
    getJalaliDate(date) {
        // Proper implementation for converting Gregorian to Jalali
        const gy = date.getFullYear();
        const gm = date.getMonth() + 1;
        const gd = date.getDate();
        var g_d_m, jy, jm, jd, gy2, days;
        g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        gy2 = (gm > 2) ? (gy + 1) : gy;
        days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
        jy = -1595 + (33 * ~~(days / 12053));
        days %= 12053;
        jy += 4 * ~~(days / 1461);
        days %= 1461;
        if (days > 365) {
        jy += ~~((days - 1) / 365);
        days = (days - 1) % 365;
        }
        if (days < 186) {
        jm = 1 + ~~(days / 31);
        jd = 1 + (days % 31);
        } else {
        jm = 7 + ~~((days - 186) / 30);
        jd = 1 + ((days - 186) % 30);
        }
        // alert(jy + ' ' + jm + ' ' + jd);
        return {
            year: jy,
            month: jm,
            day: jd
        };
    }
  
    /**
     * Get days for Jalali month calendar view
     * 
     * @param {number} year Jalali year
     * @param {number} month Jalali month
     * @returns {Array} Array of day objects
     */
    getJalaliMonthDays(year, month) {
        const days = [];
        
        // Ensure this.today is defined before accessing it
        if (!this.today) {
            // Try to set proper Jalali date
            try {
                const now = new Date();
                const jalaliDate = this.getJalaliDate(now);
                if (jalaliDate && typeof jalaliDate.year !== 'undefined') {
                    this.today = jalaliDate;
                } else {
                    // This is a fallback, but should not happen with the current getJalaliDate implementation
                    this.today = this.getJalaliDate(new Date());
                }
            } catch (error) {
                console.warn('PDatepicker: Error getting Jalali date for today, using fallback');
                this.today = this.getJalaliDate(new Date());
            }
        }
        
        // Get days in current month (31 for months 1-6, 30 for months 7-11, 29/30 for month 12)
        let daysInMonth;
        if (month <= 6) {
            daysInMonth = 31;
        } else if (month <= 11) {
            daysInMonth = 30;
        } else {
            // Check if year is leap for month 12
            const mod = year % 33;
            daysInMonth = (mod === 1 || mod === 5 || mod === 9 || mod === 13 || 
                           mod === 17 || mod === 22 || mod === 26 || mod === 30) ? 30 : 29;
        }
        
        // Get the day of week for first day of month (0 = Saturday in Jalali calendar)
        // For simplicity, we'll use a reasonable approximation
        let firstDayOfMonth;
        if (month === 1) {
            // First day of Farvardin is usually March 21 (could be March 20/22 depending on the year)
            const gregorianYear = year + 621;
            const gregorianDate = new Date(gregorianYear, 2, 21); // March 21
            firstDayOfMonth = (gregorianDate.getDay() + 1) % 7; // Convert to Jalali week (Saturday is first day)
        } else {
            // For other months, we'll use a simple offset based on the number of days in previous months
            // This is a simplification and may not be accurate for all years
            let daysPassed = 0;
            for (let m = 1; m < month; m++) {
                if (m <= 6) daysPassed += 31;
                else if (m <= 11) daysPassed += 30;
                else {
                    const mod = year % 33;
                    daysPassed += (mod === 1 || mod === 5 || mod === 9 || mod === 13 || 
                                 mod === 17 || mod === 22 || mod === 26 || mod === 30) ? 30 : 29;
                }
            }
            firstDayOfMonth = (daysPassed % 7);
        }
        
        // Add days from previous month
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        let prevMonthDays;
        if (prevMonth <= 6) {
            prevMonthDays = 31;
        } else if (prevMonth <= 11) {
            prevMonthDays = 30;
        } else {
            const mod = prevYear % 33;
            prevMonthDays = (mod === 1 || mod === 5 || mod === 9 || mod === 13 || 
                           mod === 17 || mod === 22 || mod === 26 || mod === 30) ? 30 : 29;
        }
        
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({
                day: prevMonthDays - firstDayOfMonth + i + 1,
                month: prevMonth,
                year: prevYear,
                current: false,
                today: false,
                selected: false
            });
        }
        
        // Add days from current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                month: month,
                year: year,
                current: true,
                today: i === this.today.day && month === this.today.month && year === this.today.year,
                selected: i === this.currentViewDate.day && month === this.currentViewDate.month && year === this.currentViewDate.year
            });
        }
        
        // Add days from next month
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        const remainingDays = 42 - days.length;
        
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                month: nextMonth,
                year: nextYear,
                current: false,
                today: false,
                selected: false
            });
        }
        
        return days;
    }

    /**
     * Get days for Gregorian month calendar view
     * 
     * @param {number} year Gregorian year
     * @param {number} month Gregorian month
     * @returns {Array} Array of day objects
     */
    getGregorianMonthDays(year, month) {
        const days = [];
        const date = new Date(year, month - 1, 1);
        const daysInMonth = new Date(year, month, 0).getDate();
        const startDay = date.getDay();
        
        // Ensure this.today is defined before accessing it
        if (!this.today) {
            this.today = {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                day: new Date().getDate()
            };
        }
        
        // Get previous month's last days
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        const prevMonthDays = new Date(prevYear, prevMonth, 0).getDate();
        
        // Add days from previous month
        for (let i = 0; i < startDay; i++) {
            days.push({
                day: prevMonthDays - startDay + i + 1,
                month: prevMonth,
                year: prevYear,
                current: false,
                today: false,
                selected: false
            });
        }
        
        // Add days from current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                month: month,
                year: year,
                current: true,
                today: i === this.today.day && month === this.today.month && year === this.today.year,
                selected: i === this.currentViewDate.day && month === this.currentViewDate.month && year === this.currentViewDate.year
            });
        }
        
        // Add days from next month
        const remainingDays = 42 - days.length;
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                month: nextMonth,
                year: nextYear,
                current: false,
                today: false,
                selected: false
            });
        }
        
        return days;
    }

    /**
     * Initialize time picker functionality
     */
    initializeTimePicker() {
        if (!this.options.timePicker) return;
        
        // Get time elements
        const hoursUpBtn = this.timePicker.querySelector('.pdatepicker-time-hours .pdatepicker-time-up');
        const hoursDownBtn = this.timePicker.querySelector('.pdatepicker-time-hours .pdatepicker-time-down');
        const hoursValue = this.timePicker.querySelector('.pdatepicker-time-hours .pdatepicker-time-value');
        
        const minutesUpBtn = this.timePicker.querySelector('.pdatepicker-time-minutes .pdatepicker-time-up');
        const minutesDownBtn = this.timePicker.querySelector('.pdatepicker-time-minutes .pdatepicker-time-down');
        const minutesValue = this.timePicker.querySelector('.pdatepicker-time-minutes .pdatepicker-time-value');
        
        const secondsUpBtn = this.timePicker.querySelector('.pdatepicker-time-seconds .pdatepicker-time-up');
        const secondsDownBtn = this.timePicker.querySelector('.pdatepicker-time-seconds .pdatepicker-time-down');
        const secondsValue = this.timePicker.querySelector('.pdatepicker-time-seconds .pdatepicker-time-value');
        
        // Initialize time values
        const now = new Date();
        if (!this.currentViewDate.hours) {
            this.currentViewDate.hours = now.getHours();
        }
        if (!this.currentViewDate.minutes) {
            this.currentViewDate.minutes = now.getMinutes();
        }
        if (!this.currentViewDate.seconds) {
            this.currentViewDate.seconds = now.getSeconds();
        }
        
        // Update display
        this.updateTimePickerDisplay();
        
        // Hours up button
        hoursUpBtn.addEventListener('click', () => {
            this.currentViewDate.hours = (this.currentViewDate.hours + 1) % 24;
            this.updateTimePickerDisplay();
            this.updateTimeInInput();
        });
        
        // Hours down button
        hoursDownBtn.addEventListener('click', () => {
            this.currentViewDate.hours = (this.currentViewDate.hours - 1 + 24) % 24;
            this.updateTimePickerDisplay();
            this.updateTimeInInput();
        });
        
        // Minutes up button
        minutesUpBtn.addEventListener('click', () => {
            this.currentViewDate.minutes = (this.currentViewDate.minutes + 1) % 60;
            this.updateTimePickerDisplay();
            this.updateTimeInInput();
        });
        
        // Minutes down button
        minutesDownBtn.addEventListener('click', () => {
            this.currentViewDate.minutes = (this.currentViewDate.minutes - 1 + 60) % 60;
            this.updateTimePickerDisplay();
            this.updateTimeInInput();
        });
        
        // Seconds up button
        secondsUpBtn.addEventListener('click', () => {
            this.currentViewDate.seconds = (this.currentViewDate.seconds + 1) % 60;
            this.updateTimePickerDisplay();
            this.updateTimeInInput();
        });
        
        // Seconds down button
        secondsDownBtn.addEventListener('click', () => {
            this.currentViewDate.seconds = (this.currentViewDate.seconds - 1 + 60) % 60;
            this.updateTimePickerDisplay();
            this.updateTimeInInput();
        });
    }
    
    /**
     * Update time picker display
     */
    updateTimePickerDisplay() {
        if (!this.options.timePicker) return;
        
        const hoursValue = this.timePicker.querySelector('.pdatepicker-time-hours .pdatepicker-time-value');
        const minutesValue = this.timePicker.querySelector('.pdatepicker-time-minutes .pdatepicker-time-value');
        const secondsValue = this.timePicker.querySelector('.pdatepicker-time-seconds .pdatepicker-time-value');
        
        // Format hours, minutes, and seconds with leading zeros
        hoursValue.textContent = this.currentViewDate.hours.toString().padStart(2, '0');
        minutesValue.textContent = this.currentViewDate.minutes.toString().padStart(2, '0');
        secondsValue.textContent = this.currentViewDate.seconds.toString().padStart(2, '0');
    }
    
    /**
     * Update time in input field
     */
    updateTimeInInput() {
        if (!this.input.value) return;
        
        // Format the date part using the specified format
        const dateStr = `${this.currentViewDate.year}/${this.currentViewDate.month}/${this.currentViewDate.day}`;
        let formattedDate = this.formatDate(dateStr, this.options.format);
        
        // Format time according to timeFormat option
        const timeStr = this.formatTime(
            this.currentViewDate.hours,
            this.currentViewDate.minutes,
            this.currentViewDate.seconds,
            this.options.timeFormat
        );
        
        // Update input value with formatted date and time
        this.input.value = `${formattedDate} ${timeStr}`;
        
        // Update alt field if specified
        if (this.options.altField) {
            const altField = document.querySelector(this.options.altField);
            if (altField) {
                const altFormat = this.options.altFormat || this.options.format;
                let altFormattedDate = this.formatDate(dateStr, altFormat);
                altField.value = `${altFormattedDate} ${timeStr}`;
            }
        }
        
        // Call onSelect callback
        if (typeof this.options.onSelect === 'function') {
            this.options.onSelect(this.input.value, dateStr);
        }
    }

    /**
     * Update datepicker styles
     * 
     * @param {object} customStyles New custom styles to apply
     */
    updateStyles(customStyles) {
        // Update the options
        this.options.customStyles = { ...this.options.customStyles, ...customStyles };
        
        // Apply the updated styles
        this.applyCustomStyles();
        
        // Re-render the current view to ensure all elements have updated styles
        this.refreshView();
    }
    
    /**
     * Refresh the current view
     */
    refreshView() {
        switch (this.options.viewMode) {
            case 'day':
                this.renderDaysView();
                break;
            case 'month':
                this.renderMonthsView();
                break;
            case 'year':
                this.renderYearsView();
                break;
            default:
                this.renderDaysView();
        }
        
        if (this.options.timePicker) {
            this.updateTimePickerDisplay();
        }
    }
    
    /**
     * Add additional styles to elements during rendering
     * 
     * @param {string} elementType Type of element being rendered (day, weekday, month, year, etc.)
     * @param {HTMLElement} element The DOM element
     */
    applyDynamicStyles(elementType, element) {
        const customStyles = this.options.customStyles;
        if (!customStyles) return;
        
        switch (elementType) {
            case 'day':
                if (customStyles.day) {
                    this.applyStyles(element, customStyles.day);
                }
                break;
            case 'weekday':
                if (customStyles.weekday) {
                    this.applyStyles(element, customStyles.weekday);
                }
                break;
            case 'month':
                if (customStyles.month) {
                    this.applyStyles(element, customStyles.month);
                }
                break;
            case 'year':
                if (customStyles.year) {
                    this.applyStyles(element, customStyles.year);
                }
                break;
            // Additional element types can be added here
        }
    }
}