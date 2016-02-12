
var Donations = {
    notified: false,
    numbers: [],
    incrementBy: 13,
    displayValue: 0,
    value: 0,
    $value: $('<span>'),

    init: function () {
        $('#donation').unbind().keydown(function (e) {
            if (e.keyCode == 13) {
                if (!Donations.notify()) return;

                var val = $(this).val().split('|');
                if (val[0] == '') val[0] = 0;

                var data = {
                    value: parseInt(val[0]) + Donations.value
                };
                if (val[1]) data.increment = val[1];

                socket.emit('donation', data);
                $(this).val('');
            }
            e.stopPropagation();
        });

        socket.on('donation', function (data) {
            if (data.increment) {
                Donations.incrementBy = parseInt(data.increment);
            }
            Donations.updateValue(data.value);
        });

        $('#donation').after(Donations.$value);

        $('.counter').append('<div class="numbers">');

        for (var i = 5; i >= 0; i--) {
            Donations.numbers[i] = new CounterNumber(i);
            $('.numbers').append(Donations.numbers[i].get());
        }

        Donations.numbers[2].get().before('<span class="comma">,</span>');
        $('.numbers').append($('<div>dollars</div>').css('font-size', '.8em'));
    },
    updateValue: function (updateTo) {
        if (updateTo == null) {
            updateTo = 0;
            for (var i in Donations.numbers) {
                Donations.numbers[i].set('0');
            }
        }
        Donations.value = updateTo;
        Donations.$value.text(Donations.value);

        clearTimeout(Donations.timer);
        Donations.timer = setTimeout(Donations.increment, 300);
    },
    increment: function () {
        Donations.displayValue += Donations.incrementBy;

        if (Donations.displayValue > Donations.value) {
            Donations.displayValue = Donations.value;
        } else {
            Donations.timer = setTimeout(Donations.increment, 300);
        }

        Donations.updateDisplayValue();
    },
    updateDisplayValue: function () {
        var updateTo = Donations.displayValue + '';
        updateTo = updateTo.split('').reverse();

        for (var i in updateTo) {
            Donations.numbers[i].set(updateTo[i]);
        }
    },
    notify: function () {
        if (!Donations.notified) {
            Donations.notified = confirm("Sending this value will make this browser window the new master. That means the Current Value will be updated to reflect what you have locally.\n\nProceed?");
        }

        return Donations.notified;
    }
};

var CounterNumber = function (i) {
    this.val = 0;
    this.$e = $('<div class="number-'+i+' number">').text(0);

    this.$e.on('webkitTransitionEnd', function () {
        var $this = $(this);
        var num = $this.data('transition-to');

        if ($this.text() === num) return;

        $this.text(num);
        $this.addClass('no-transition').css('-webkit-transform', 'rotateX(90deg)');

        setTimeout(function () {
            $this.removeClass('no-transition').css('-webkit-transform', 'rotateX(0deg)');
        }, 1);
    });
};

CounterNumber.prototype.get = function () {
    return this.$e;
};

CounterNumber.prototype.set = function (num) {
    if (!this.$e.is(':visible')) this.$e.text(num).css('-webkit-transform', 'rotateX(0)');

    if (this.$e.text() === num) return;

    this.$e.css('-webkit-transform', 'rotateX(-90deg)').data('transition-to', num);
};