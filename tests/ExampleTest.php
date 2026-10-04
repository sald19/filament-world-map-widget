<?php

use InfinityXTech\FilamentWorldMapWidget\Widgets\WorldMapWidget;
use Livewire\Livewire;

it('can test', function () {
    expect(true)->toBeTrue();
});

it('can render world map widget', function () {
    Livewire::test(WorldMapWidget::class)
        ->assertSuccessful();
});
