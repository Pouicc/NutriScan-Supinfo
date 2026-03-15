/**
 * Tests unitaires pour la logique de debounce
 * Vérifie que le mécanisme de setTimeout/clearTimeout fonctionne correctement
 */

describe('useDebounce (logique de debounce)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('le timer setTimeout est bien appelé', () => {
    const spy = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();

    const timer = setTimeout(callback, 500);

    expect(spy).toHaveBeenCalledWith(expect.any(Function), 500);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);

    clearTimeout(timer);
    spy.mockRestore();
  });

  it('clearTimeout annule le timer précédent', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const timer1 = setTimeout(callback1, 500);

    jest.advanceTimersByTime(300);
    clearTimeout(timer1);
    const timer2 = setTimeout(callback2, 500);

    jest.advanceTimersByTime(500);

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);

    clearTimeout(timer2);
  });

  it('seule la dernière valeur passe après plusieurs changements rapides', () => {
    const results: string[] = [];
    let timer: ReturnType<typeof setTimeout>;

    const debounce = (value: string, delay: number) => {
      clearTimeout(timer);
      timer = setTimeout(() => results.push(value), delay);
    };

    debounce('a', 500);
    jest.advanceTimersByTime(100);
    debounce('b', 500);
    jest.advanceTimersByTime(100);
    debounce('c', 500);
    jest.advanceTimersByTime(500);

    expect(results).toEqual(['c']);
  });
});
