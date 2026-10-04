# Filament World Map Widget

[![Latest Version on Packagist](https://img.shields.io/packagist/v/infinityxtech/filament-world-map-widget.svg?style=flat-square)](https://packagist.org/packages/infinityxtech/filament-world-map-widget)
[![GitHub Tests Action Status](https://img.shields.io/github/actions/workflow/status/infinityxtech/filament-world-map-widget/run-tests.yml?branch=main&label=tests&style=flat-square)](https://github.com/infinityxtech/filament-world-map-widget/actions?query=workflow%3Arun-tests+branch%3Amain)
[![GitHub Code Style Action Status](https://img.shields.io/github/actions/workflow/status/infinityxtech/filament-world-map-widget/fix-php-code-styling.yml?branch=main&label=code%20style&style=flat-square)](https://github.com/infinityxtech/filament-world-map-widget/actions?query=workflow%3A"Fix+PHP+code+styling"+branch%3Amain)
[![Total Downloads](https://img.shields.io/packagist/dt/infinityxtech/filament-world-map-widget.svg?style=flat-square)](https://packagist.org/packages/infinityxtech/filament-world-map-widget)

![World map widget screenshot](https://github.com/user-attachments/assets/5373a841-6918-42b1-8227-698261a774b5)

Display country-level statistics in a Filament widget powered by [jsVectorMap](https://jvm-docs.vercel.app/docs/introduction).

## Compatibility

| Branch | Filament | PHP |
| --- | --- | --- |
| `main` | `^5.0` | `^8.3` |
| `v4` | `^4.0` | `^8.1` |
| `v3` | `^3.0` | `^8.1` |

## Installation

```bash
composer require infinityxtech/filament-world-map-widget
```

## Creating a widget

```bash
php artisan make:filament-map-widget VisitorGeoMap
```

Register the widget in a Filament dashboard or page:

```php
use App\Filament\Widgets\VisitorGeoMap;

public function getWidgets(): array
{
    return [
        VisitorGeoMap::class,
    ];
}
```

## Dashboard Filters

The widget supports Filament dashboard filters, including live filters from `HasFiltersForm`. The map container remains protected with `wire:ignore`, while the widget root gets a checksum key so Livewire remounts the Alpine map when `stats()` or map options change.

```php
namespace App\Filament\Widgets;

use Filament\Widgets\Concerns\InteractsWithPageFilters;
use InfinityXTech\FilamentWorldMapWidget\Widgets\WorldMapWidget;

class VisitorGeoMap extends WorldMapWidget
{
    use InteractsWithPageFilters;

    public function stats(): array
    {
        $range = $this->pageFilters['range'] ?? null;

        return [
            'US' => filled($range) ? 70000 : 35000,
            'RS' => filled($range) ? 30000 : 15000,
        ];
    }
}
```

```php
namespace App\Filament\Pages;

use App\Filament\Widgets\VisitorGeoMap;
use Filament\Forms\Components\DatePicker;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Pages\Dashboard\Concerns\HasFiltersForm;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class Dashboard extends BaseDashboard
{
    use HasFiltersForm;

    public function filtersForm(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->schema([
                        DatePicker::make('range')
                            ->label('Date range')
                            ->live(),
                    ])
                    ->columns(2)
                    ->columnSpanFull(),
            ]);
    }

    public function getWidgets(): array
    {
        return [
            VisitorGeoMap::class,
        ];
    }
}
```

## Available Maps

```php
Map::WORLD
Map::WORLD_MERC
Map::US_MILL_EN
Map::US_MERC_EN
Map::US_LCC_EN
Map::US_AEA_EN
Map::SPAIN
Map::RUSSIA
Map::CANADA
Map::IRAQ
Map::BRASIL
```

## Customization

Override any of these methods in your widget:

```php
use Illuminate\Contracts\Support\Htmlable;
use InfinityXTech\FilamentWorldMapWidget\Enums\Map;

public function stats(): array
{
    return [
        'US' => 35000,
        'RS' => 15000,
    ];
}

public function heading(): string | Htmlable | null
{
    return 'World Map';
}

public function tooltip(): string | Htmlable
{
    return 'stats';
}

public function map(): Map | string
{
    return Map::WORLD;
}

public function customMapUrl(): ?string
{
    return null;
}

public function color(): array
{
    return [0, 120, 215];
}

public function height(): string
{
    return '332px';
}

public function additionalOptions(): array
{
    return [];
}
```

To include a custom map, publish an accessible jsVectorMap map file and return both the map name and URL:

```php
public function map(): Map | string
{
    return 'custom-map';
}

public function customMapUrl(): ?string
{
    return 'https://example.test/js/custom-map.js';
}
```

For more map options, see the [jsVectorMap documentation](https://jvm-docs.vercel.app/docs/introduction).

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [InfinityX Tech](https://github.com/InfinityXTech)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
