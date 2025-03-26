<?php

namespace PDatepicker;

use Morilog\Jalali\Jalalian;

class PDatepicker
{
    /**
     * Convert Gregorian date to Jalali
     *
     * @param  string|DateTime  $date
     * @param  string  $format
     * @return string
     */
    public function toJalali($date, $format = 'Y/m/d')
    {
        return Jalalian::fromDateTime($date)->format($format);
    }

    /**
     * Convert Jalali date to Gregorian
     *
     * @param  string  $date
     * @param  string  $format
     * @return string
     */
    public function toGregorian($date, $format = 'Y-m-d')
    {
        $parts = explode('/', $date);
        if (count($parts) !== 3) {
            throw new \Exception('Invalid date format');
        }
        
        return Jalalian::fromFormat('Y/m/d', $date)->toCarbon()->format($format);
    }

    /**
     * Get current Jalali date
     *
     * @param  string  $format
     * @return string
     */
    public function now($format = 'Y/m/d')
    {
        return Jalalian::now()->format($format);
    }

    /**
     * Render datepicker HTML
     *
     * @param  string  $name
     * @param  string|null  $value
     * @param  array  $options
     * @return string
     */
    public function render($name, $value = null, array $options = [])
    {
        $id = $options['id'] ?? $name;
        $class = $options['class'] ?? 'form-control pdatepicker';
        $placeholder = $options['placeholder'] ?? 'انتخاب تاریخ';
        $format = $options['format'] ?? config('pdatepicker.format', 'YYYY/MM/DD');
        $theme = $options['theme'] ?? config('pdatepicker.theme', 'default');
        $rtl = $options['rtl'] ?? config('pdatepicker.rtl', true);
        $language = $options['language'] ?? config('pdatepicker.language', 'fa');
        $autoClose = $options['autoClose'] ?? config('pdatepicker.autoClose', true);
        $timePicker = $options['timePicker'] ?? config('pdatepicker.timePicker', false);
        $viewMode = $options['viewMode'] ?? config('pdatepicker.viewMode', 'day');
        
        $attributes = '';
        foreach ($options as $key => $value) {
            if (!in_array($key, ['id', 'class', 'placeholder', 'format', 'theme', 'rtl', 'language', 'autoClose', 'timePicker', 'viewMode'])) {
                $attributes .= $key . '="' . $value . '" ';
            }
        }

        $html = '<input type="text" name="' . $name . '" id="' . $id . '" class="' . $class . '" placeholder="' . $placeholder . '" ' . $attributes . '>';
        $html .= '<script>
            document.addEventListener("DOMContentLoaded", function() {
                new PDatepicker("#' . $id . '", {
                    format: "' . $format . '",
                    theme: "' . $theme . '",
                    rtl: ' . ($rtl ? 'true' : 'false') . ',
                    language: "' . $language . '",
                    autoClose: ' . ($autoClose ? 'true' : 'false') . ',
                    timePicker: ' . ($timePicker ? 'true' : 'false') . ',
                    viewMode: "' . $viewMode . '"
                });
            });
        </script>';

        return $html;
    }
} 