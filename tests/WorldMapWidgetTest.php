<?php

use InfinityXTech\FilamentWorldMapWidget\Widgets\WorldMapWidget;

it('provides a refresh key and unique selector for the ignored map element', function () {
    $widget = new TestWorldMapWidget;
    $widget->setId('test-widget');

    expect($widget->getMapId())->toBe('filament-world-map-widget-test-widget')
        ->and($widget->getMapSelector())->toBe('#filament-world-map-widget-test-widget')
        ->and($widget->getMapChecksum())->toStartWith('filament-world-map-widget-')
        ->and(file_get_contents(__DIR__.'/../resources/views/widgets/world-map-widget.blade.php'))
        ->toContain('wire:key="{{ $this->getMapChecksum() }}"')
        ->toContain('<div wire:ignore>');
});

class TestWorldMapWidget extends WorldMapWidget
{
    public function stats(): array
    {
        return [
            'US' => 10,
            'RS' => 20,
        ];
    }
}
