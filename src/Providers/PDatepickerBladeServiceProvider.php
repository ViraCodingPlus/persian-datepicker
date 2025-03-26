<?php

namespace PDatepicker\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use PDatepicker\PDatepicker;

class PDatepickerBladeServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // Register the directive
        Blade::directive('pdatepicker', function ($expression) {
            return "<?php echo app('pdatepicker')->render($expression); ?>";
        });
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('pdatepicker', function () {
            return new PDatepicker();
        });
    }
} 