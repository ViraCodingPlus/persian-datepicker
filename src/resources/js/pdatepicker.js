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
            viewMode: 'day',
            minDate: null,
            maxDate: null,
            initialValue: null,
            position: 'bottom',
            altField: null,
            altFormat: null,
            onSelect: null,
            onShow: null,
            onHide: null
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

        // Attach event listeners
        this.attachEventListeners();

        // Set initial value if provided
        if (this.options.initialValue) {
            this.setDate(this.options.initialValue);
        }
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
            
            // Create today's date with fallback values in case getJalaliDate fails
            try {
                this.today = this.getJalaliDate(new Date());
                // Ensure today has all required properties
                if (!this.today || typeof this.today.year === 'undefined') {
                    console.warn('PDatepicker: Failed to get Jalali date, using fallback values');
                    this.today = { year: 1402, month: 1, day: 1 };
                }
            } catch (error) {
                console.error('PDatepicker: Error in getJalaliDate', error);
                this.today = { year: 1402, month: 1, day: 1 };
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
        this.currentViewDate = this.today ? { ...this.today } : { year: 1402, month: 1, day: 1 };
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
            console.warn('PDatepicker: currentViewDate is undefined, initializing with defaults');
            this.currentViewDate = { year: 1402, month: 1, day: 1 };
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
        for (let i = 0; i < 7; i++) {
            const dayName = i < this.dayNames.length ? this.dayNames[i] : `D${i}`;
            html += `<div class="pdatepicker-week-day">${dayName}</div>`;
        }
        html += '</div>';
        
        html += '<div class="pdatepicker-days-grid">';
        days.forEach(day => {
            let classes = ['pdatepicker-day'];
            if (day.current) classes.push('pdatepicker-day-current');
            if (day.today) classes.push('pdatepicker-day-today');
            if (day.selected) classes.push('pdatepicker-day-selected');
            if (!day.current) classes.push('pdatepicker-day-other-month');
            
            html += `<div class="${classes.join(' ')}" data-date="${day.year}/${day.month}/${day.day}">${day.day}</div>`;
        });
        html += '</div>';
        html += '</div>';
        
        // Update body
        this.body.innerHTML = html;
        
        // Attach click events to days
        const dayElements = this.body.querySelectorAll('.pdatepicker-day');
        dayElements.forEach(day => {
            day.addEventListener('click', () => {
                this.selectDate(day.dataset.date);
            });
        });
    }

    /**
     * Render months view
     */
    renderMonthsView() {
        this.options.viewMode = 'month';
        
        // Safety check to prevent undefined errors
        if (!this.currentViewDate) {
            console.warn('PDatepicker: currentViewDate is undefined, initializing with defaults');
            this.currentViewDate = { year: 1402, month: 1, day: 1 };
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
        
        // Create months grid
        let html = '<div class="pdatepicker-months">';
        for (let i = 0; i < 12; i++) {
            let classes = ['pdatepicker-month'];
            if (i + 1 === this.currentViewDate.month && year === this.currentViewDate.year) {
                classes.push('pdatepicker-month-selected');
            }
            
            // Safety check for month index bounds
            const monthName = i < this.monthNames.length ? this.monthNames[i] : `Month ${i+1}`;
            html += `<div class="${classes.join(' ')}" data-month="${i + 1}">${monthName}</div>`;
        }
        html += '</div>';
        
        // Update body
        this.body.innerHTML = html;
        
        // Attach click events to months
        const monthElements = this.body.querySelectorAll('.pdatepicker-month');
        monthElements.forEach(month => {
            month.addEventListener('click', () => {
                this.currentViewDate.month = parseInt(month.dataset.month);
                this.renderDaysView();
            });
        });
    }

    /**
     * Render years view
     */
    renderYearsView() {
        this.options.viewMode = 'year';
        
        // Safety check to prevent undefined errors
        if (!this.currentViewDate) {
            console.warn('PDatepicker: currentViewDate is undefined, initializing with defaults');
            this.currentViewDate = { year: 1402, month: 1, day: 1 };
        }
        
        const year = this.currentViewDate.year;
        const startYear = Math.floor(year / 12) * 12;
        const endYear = startYear + 11;
        
        // Update title
        this.title.textContent = `${startYear} - ${endYear}`;
        
        // Create years grid
        let html = '<div class="pdatepicker-years">';
        for (let i = startYear; i <= endYear; i++) {
            let classes = ['pdatepicker-year'];
            if (i === this.currentViewDate.year) {
                classes.push('pdatepicker-year-selected');
            }
            
            html += `<div class="${classes.join(' ')}" data-year="${i}">${i}</div>`;
        }
        html += '</div>';
        
        // Update body
        this.body.innerHTML = html;
        
        // Attach click events to years
        const yearElements = this.body.querySelectorAll('.pdatepicker-year');
        yearElements.forEach(yearEl => {
            yearEl.addEventListener('click', () => {
                this.currentViewDate.year = parseInt(yearEl.dataset.year);
                this.renderMonthsView();
            });
        });
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
        
        // Format date according to options
        let formattedDate = this.formatDate(date, this.options.format);
        
        // Set input value
        this.input.value = formattedDate;
        
        // Set alt field value if specified
        if (this.options.altField) {
            const altField = document.querySelector(this.options.altField);
            if (altField) {
                const altFormat = this.options.altFormat || this.options.format;
                altField.value = this.formatDate(date, altFormat);
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
        
        // Auto close if enabled
        if (this.options.autoClose) {
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
        
        return format
            .replace('YYYY', year)
            .replace('YY', year.slice(-2))
            .replace('MM', month.toString().padStart(2, '0'))
            .replace('M', month)
            .replace('DD', day.toString().padStart(2, '0'))
            .replace('D', day);
    }

    /**
     * Get Jalali date from Gregorian date
     * 
     * @param {Date} date Gregorian date
     * @returns {object} Jalali date object {year, month, day}
     */
    getJalaliDate(date) {
        // Proper implementation for converting Gregorian to Jalali
        const gregorianYear = date.getFullYear();
        const gregorianMonth = date.getMonth() + 1;
        const gregorianDay = date.getDate();
        
        // Convert to Jalali
        let jalaliYear, jalaliMonth, jalaliDay;
        
        // Constants for conversion
        const breaks = [
            -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181,
            1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456
        ];
        
        // Helper function to determine if Gregorian year is leap
        const isGregorianLeap = (year) => {
            return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
        };
        
        // Helper function to determine if Jalali year is leap
        const isJalaliLeap = (year) => {
            const mod = year % 33;
            return mod === 1 || mod === 5 || mod === 9 || mod === 13 || mod === 17 || mod === 22 || mod === 26 || mod === 30;
        };
        
        // Convert date
        let gYear = gregorianYear;
        let gMonth = gregorianMonth - 1;
        let gDay = gregorianDay;
        let gy = gYear;
        
        if (gYear > 1600) {
            const jy = 979;
            gYear -= 1600;
        } else {
            const jy = 0;
            gYear -= 621;
        }
        
        const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
        
        // Adjust for leap years
        if (isGregorianLeap(gy) || (gy + 1600) === 2000) {
            gDaysInMonth[1] = 29;
        }
        
        // Find day of year for Gregorian date
        let gDayOfYear = gDay;
        for (let i = 0; i < gMonth; i++) {
            gDayOfYear += gDaysInMonth[i];
        }
        
        // Find Jalali year
        let jDayOfYear;
        let jYear = gYear - 621;
        const jMonthDay = isJalaliLeap(jYear) ? 366 : 365;
        
        if (gDayOfYear <= 286) {
            jDayOfYear = gDayOfYear + 79;
        } else {
            jDayOfYear = gDayOfYear - 286;
            jYear += 1;
        }
        
        // Find Jalali month and day
        let i;
        for (i = 0; i < 11 && jDayOfYear > jDaysInMonth[i]; i++) {
            jDayOfYear -= jDaysInMonth[i];
        }
        
        const jMonth = i + 1;
        const jDay = jDayOfYear;
        
        return {
            year: jYear,
            month: jMonth,
            day: jDay
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
}