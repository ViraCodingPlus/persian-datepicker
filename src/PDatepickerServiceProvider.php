<?php

namespace PDatepicker;

use Illuminate\Support\ServiceProvider;
use PDatepicker\Providers\PDatepickerBladeServiceProvider;

class PDatepickerServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        // Register views
        $this->loadViewsFrom(__DIR__ . '/resources/views', 'pdatepicker');

        // Register routes
        $this->loadRoutesFrom(__DIR__ . '/routes/web.php');

        // Register migrations
        $this->loadMigrationsFrom(__DIR__ . '/database/migrations');

        // Merge configurations
        $this->mergeConfigFrom(__DIR__ . '/config/pdatepicker.php', 'pdatepicker');

        // Register blade service provider
        $this->app->register(PDatepickerBladeServiceProvider::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // Publish configuration
        $this->publishes([
            __DIR__ . '/config/pdatepicker.php' => config_path('pdatepicker.php'),
        ], 'pdatepicker-config');

        // Publish assets
        $this->publishes([
            __DIR__ . '/resources/js' => public_path('vendor/pdatepicker/js'),
            __DIR__ . '/resources/css' => public_path('vendor/pdatepicker/css'),
        ], 'pdatepicker-assets');

        // Publish views
        $this->publishes([
            __DIR__ . '/resources/views' => resource_path('views/vendor/pdatepicker'),
        ], 'pdatepicker-views');
    }
} 